FROM node:20-slim AS build

WORKDIR /app

COPY ai-yapper-agent ai-yapper-agent
COPY aiya-web-app aiya-web-app

# build the bundle
RUN cd ai-yapper-agent && npm install && npm run build && cd ..
ENTRYPOINT ["sh", "-c"]
CMD ["cd aiya-web-app && npm install && npm run dev"]

EXPOSE 3000
