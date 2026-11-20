import { useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import {
  Atlas,
  Canvas,
  FilterMode,
  Group,
  Image,
  MipmapMode,
  rect,
  Skia,
  type SkImage,
} from 'react-native-skia';

export const name = 'skia-atlas-perspective';
export const description =
  'An <Atlas> under a perspective Group matrix loses parts of its sprites (cut along their diagonal or missing); the same sprites drawn as images are whole.';

const CELL = 128; // sprite size in the sheet
const GRID = 4; // sprites per row and column on each side
const SAMPLING = { filter: FilterMode.Linear, mipmap: MipmapMode.Linear };

// A one-sprite sheet: an opaque square with a dark ring, drawn at runtime.
function makeSheet(): SkImage {
  const surface = Skia.Surface.MakeOffscreen(CELL, CELL)!;
  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  paint.setColor(Skia.Color('#202020'));
  canvas.drawRect(Skia.XYWHRect(0, 0, CELL, CELL), paint);
  paint.setColor(Skia.Color('#ff00ff'));
  canvas.drawRect(Skia.XYWHRect(12, 12, CELL - 24, CELL - 24), paint);
  surface.flush();
  return surface.makeImageSnapshot();
}

// The 3x3 matrix taking a size x size square onto the quad (Heckbert's
// square-to-quad), row-major as Skia reads it: a board tilting away.
function squareToQuad(size: number, q: number[]): number[] {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return [a / size, b / size, x0, d / size, e / size, y0, g / size, h / size, 1];
}

function AtlasPerspective() {
  const { width } = useWindowDimensions();
  const [tilted, setTilted] = useState(true);
  const sheet = useMemo(makeSheet, []);
  const half = width / 2;
  const size = half - 16; // each side's grid, in points
  const step = size / GRID;
  const scale = (step - 6) / CELL;

  const sprites = useMemo(
    () => Array.from({ length: GRID * GRID }, () => rect(0, 0, CELL, CELL)),
    [],
  );
  const transforms = useMemo(
    () =>
      Array.from({ length: GRID * GRID }, (_, i) =>
        Skia.RSXform(scale, 0, (i % GRID) * step + 3, Math.floor(i / GRID) * step + 3),
      ),
    [scale, step],
  );
  // The whole canvas (both grids side by side) tilting away, far edge shorter.
  const W = width - 16;
  const H = size;
  const matrix = tilted
    ? squareToQuad(1, [8 + W * 0.18, 10, 8 + W * 0.82, 30, 8 + W, H + 40, 8, H + 20]).map((v, i) =>
        // the square here is 1x1: scale its x/y inputs back to W x H
        i % 3 === 0 ? v / W : i % 3 === 1 ? v / H : v,
      )
    : [1, 0, 8, 0, 1, 0, 0, 0, 1];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Perspective</Text>
        <Switch testID="tilt" value={tilted} onValueChange={setTilted} />
      </View>
      <View style={styles.row}>
        <Text style={styles.caption}>{'<Atlas> (left)'}</Text>
        <Text style={styles.caption}>{'<Image> per sprite (right)'}</Text>
      </View>
      <Canvas style={{ width, height: size + 80 }}>
        <Group matrix={matrix}>
          <Atlas image={sheet} sprites={sprites} transforms={transforms} sampling={SAMPLING} />
          {transforms.map((t, i) => (
            <Image
              key={i}
              image={sheet}
              x={t.tx + half}
              y={t.ty}
              width={CELL * scale}
              height={CELL * scale}
              sampling={SAMPLING}
            />
          ))}
        </Group>
      </Canvas>
      <Text style={styles.note}>
        Expected: both sides show {GRID * GRID} whole squares, tilted or flat. Actual (react-native-skia
        3.9.0 and later, iOS and Android): with perspective on, the atlas squares are cut along their
        diagonal or missing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: 'white' },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 16 },
  caption: { fontSize: 13, color: '#555' },
  note: { margin: 16, fontSize: 13, color: '#333' },
});

export const component = AtlasPerspective;
