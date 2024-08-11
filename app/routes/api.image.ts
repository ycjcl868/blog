import { LoaderFunction } from "@remix-run/cloudflare";
import {
  imageLoader,
  MemoryCache,
  fetchResolver,
  Resolver,
  MimeType,
  RemixImageError,
} from "@udisc/remix-image/serverPure";

const cache = new MemoryCache({
  maxSize: 5e7,
});

export const loader: LoaderFunction = ({ request, context }) => {
  const resolver: Resolver = async (asset, url, options, basePath) => {
    if (asset.startsWith("/")) {
      // @ts-ignore
      const imageResponse = await context.cloudflare.env.ASSETS.fetch(
        url,
        request.clone()
      );
      const arrBuff = await imageResponse.arrayBuffer();

      if (!arrBuff || arrBuff.byteLength < 2) {
        throw new RemixImageError("Invalid image retrieved from resolver!");
      }

      const buffer = new Uint8Array(arrBuff);
      const contentType = imageResponse.headers.get(
        "content-type"
      )! as MimeType;

      return {
        buffer,
        contentType,
      };
    } else {
      return fetchResolver(asset, url, options, basePath);
    }
  };

  const config = {
    selfUrl: "http://localhost:5173",
    cache,
    resolver,
  };

  return imageLoader(config, request);
};
