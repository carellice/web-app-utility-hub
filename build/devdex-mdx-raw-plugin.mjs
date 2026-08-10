import { readFileSync } from "node:fs";

// DevDex indicizza i propri file MDX anche come testo. Il prefisso virtuale
// impedisce al compilatore MDX di trasformare gli import con ?raw in JSX.
export function devdexMdxRaw() {
  const rawExpression = /\.mdx\?raw(?:&.*)?$/;
  const virtualPrefix = "\0devdex-mdx-raw:";

  return {
    name: "devdex-mdx-raw",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!rawExpression.test(source)) return null;

      const resolved = await this.resolve(source.split("?")[0], importer, {
        skipSelf: true,
      });

      return resolved ? `${virtualPrefix}${resolved.id}` : null;
    },
    load(id) {
      if (!id.startsWith(virtualPrefix)) return null;

      try {
        return {
          code: `export default ${JSON.stringify(readFileSync(id.slice(virtualPrefix.length), "utf8"))};`,
          map: null,
        };
      } catch {
        return null;
      }
    },
  };
}
