FROM oven/bun:1
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile --productio

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "src/server.tsx"]
