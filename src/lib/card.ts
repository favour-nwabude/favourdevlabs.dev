import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const W = 1200;
const H = 630;

const readFont = (pkg: string, file: string) =>
  readFile(join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file));

let fonts: Promise<any[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFont('cormorant-garamond', 'cormorant-garamond-latin-300-normal.woff'),
    readFont('cormorant-garamond', 'cormorant-garamond-latin-300-italic.woff'),
    readFont('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
  ]).then(([serif, serifItalic, mono]) => [
    { name: 'Serif', data: serif, weight: 300, style: 'normal' },
    { name: 'Serif', data: serifItalic, weight: 300, style: 'italic' },
    { name: 'Mono', data: mono, weight: 400, style: 'normal' },
  ]));

const el = (style: Record<string, unknown>, children?: unknown) => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

export interface CardInput {
  label: string;
  title: string;
  foot: string;
}

/** 1200x630 PNG in the site palette: dark ground, gold hairline frame, serif title. */
export async function renderCard({ label, title, foot }: CardInput): Promise<Uint8Array> {
  const size = title.length > 90 ? 58 : title.length > 55 ? 68 : 84;
  const tree = el(
    {
      width: W,
      height: H,
      padding: 28,
      background: '#09090a',
      backgroundImage:
        'radial-gradient(circle at 88% 112%, rgba(184,150,74,0.16), rgba(9,9,10,0) 55%)',
    },
    el(
      {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        border: '1px solid #7a6330',
        padding: '52px 60px',
      },
      [
        el({ alignItems: 'center' }, [
          el({ width: 40, height: 1, background: '#b8964a', marginRight: 18 }),
          el({ fontFamily: 'Mono', fontSize: 22, letterSpacing: 5, color: '#b8964a' }, label),
        ]),
        el(
          { fontFamily: 'Serif', fontWeight: 300, fontSize: size, lineHeight: 1.1, letterSpacing: -1, color: '#f0ebe0' },
          title,
        ),
        el({ justifyContent: 'space-between', alignItems: 'center', width: '100%' }, [
          el({ fontFamily: 'Mono', fontSize: 20, letterSpacing: 3, color: '#9a9588' }, foot),
          el({ fontFamily: 'Mono', fontSize: 20, letterSpacing: 3, color: '#b8964a' }, 'FAVOURDEVLABS.DEV'),
        ]),
      ],
    ),
  );
  const svg = await satori(tree as any, { width: W, height: H, fonts: (await loadFonts()) as any });
  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}
