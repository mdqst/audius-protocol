FROM debian:bullseye AS cpp-builder

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    curl \
    gcc \
    ffmpeg \
    libmp3lame-dev \
    python3.9 \
    python3-pip \
    libsndfile1-dev \
    libeigen3-dev \
    libyaml-dev \
    libfftw3-dev \
    libavcodec-dev \
    libavfilter-dev \
    libavformat-dev \
    libavutil-dev \
    libswresample-dev \
    libavresample-dev \
    libsamplerate0-dev \
    libtag1-dev \
    libchromaprint-dev \
    libopus-dev \
    libvorbis-dev \
    libogg-dev \
    libflac-dev \
    pkg-config

ENV LD_LIBRARY_PATH="/usr/local/lib"

RUN git clone https://github.com/mixxxdj/libKeyFinder.git /libKeyFinder && \
    cd /libKeyFinder && \
    cmake -DCMAKE_INSTALL_PREFIX=/usr/local -DBUILD_SHARED_LIBS=ON -S . -B build && \
    cmake --build build --parallel $(nproc) && \
    cmake --install build

# essentia release tags are very old - pin to a more recent commit
ENV ESSENTIA_COMMIT="eaf8ddfd9a603fdda9850731cc39f06e6262afe5"
ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:/usr/lib/pkgconfig:/usr/lib/aarch64-linux-gnu/pkgconfig:/usr/share/pkgconfig"
RUN git clone --depth 1 https://github.com/MTG/essentia.git /essentia && \
    cd /essentia && \
    git fetch --depth 1 origin $ESSENTIA_COMMIT && \
    git checkout $ESSENTIA_COMMIT && \
    python3 waf configure --pkg-config-path=$PKG_CONFIG_PATH && \
    python3 waf && \
    python3 waf install

RUN git clone https://github.com/taglib/taglib.git /taglib && \
    cd /taglib && \
    git submodule update --init && \
    cmake -DBUILD_SHARED_LIBS=ON -DCMAKE_INSTALL_PREFIX=/usr/local -S . -B build && \
    cmake --build build --parallel $(nproc) && \
    cmake --install build

RUN git clone https://github.com/acoustid/chromaprint.git /chromaprint && \
    cd /chromaprint && \
    cmake -DBUILD_SHARED_LIBS=ON -DCMAKE_INSTALL_PREFIX=/usr/local -S . -B build && \
    cmake --build build --parallel $(nproc) && \
    cmake --install build

WORKDIR /app
COPY ./cmd/mediorum/cpp ./cpp

RUN g++ -o /bin/analyze-key /app/cpp/keyfinder.cpp \
    -I/usr/local/include -L/usr/local/lib \
    -lkeyfinder -lsndfile -lfftw3 -lfftw3f -lopus -lFLAC -lvorbis -lvorbisenc -logg -lpthread -lz && \
    chmod +x /bin/analyze-key

RUN g++ -o /bin/analyze-bpm /app/cpp/bpm-analyzer.cpp \
    -I/usr/include/eigen3 -I/usr/local/include/essentia -I/usr/local/include \
    -L/usr/local/lib \
    -lessentia -ltag -lyaml -lfftw3 -lfftw3f -lavcodec -lavformat -lavutil -lavfilter -lsamplerate -lavresample -lpthread -lz -lchromaprint && \
    chmod +x /bin/analyze-bpm


FROM golang:1.22-bullseye AS go-builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod graph | awk '{if ($1 !~ "@") print $2}' | xargs go get

COPY ./pkg ./pkg
COPY ./cmd/audiusd/main.go ./cmd/audiusd/main.go
RUN go build -o audiusd cmd/audiusd/main.go

# encoding and analysis requires a lot of dynamic links
FROM cpp-builder

COPY --from=go-builder /app/audiusd /bin/audiusd

RUN mkdir -p /env && \
    curl -o /env/stage.env https://raw.githubusercontent.com/AudiusProject/audius-docker-compose/refs/heads/stage/creator-node/stage.env && \
    curl -o /env/prod.env https://raw.githubusercontent.com/AudiusProject/audius-docker-compose/refs/heads/stage/creator-node/prod.env

COPY ./cmd/audiusd/entrypoint.sh /bin/entrypoint.sh
RUN chmod +x /bin/entrypoint.sh

RUN mkdir -p /data && chown -R postgres:postgres /data

ARG git_sha
ENV GIT_SHA=$git_sha

EXPOSE 80
EXPOSE 443
EXPOSE 26656

VOLUME ["/data"]

ENTRYPOINT ["/bin/entrypoint.sh"]
