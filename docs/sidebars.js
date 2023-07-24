module.exports = {
  sidebar: [
    {
      type: "doc",
      label: "Welcome",
      id: "welcome",
    },
    {
      type: "category",
      label: "Protocol",
      link: {
        type: "generated-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "protocol",
        },
      ],
    },
    {
      type: "category",
      label: "Token",
      link: {
        type: "generated-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "token",
        },
      ],
    },
    {
      type: "category",
      label: "Developers",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "developers/rest-api",
        },
        {
          type: "doc",
          id: "developers/hedgehog",
        },
        {
          type: "category",
          label: "Subgraph",
          items: [
            {
              type: "doc",
              id: "developers/subgraph/subgraphdata",
            },
            { type: "doc", id: "developers/subgraph/entities" },
            { type: "doc", id: "developers/subgraph/queries" },
          ],
        },
        {
          type: "category",
          label: "JavaScript SDK",
          items: [
            {
              type: "doc",
              id: "developers/sdk/index",
            },
            {
              type: "doc",
              id: "developers/sdk/classes/TracksApi",
            },
            {
              type: "doc",
              id: "developers/sdk/classes/UsersApi",
            },
            {
              type: "doc",
              id: "developers/sdk/classes/PlaylistsApi",
            },
            {
              type: "doc",
              label: "Playlists (Write)",
              id: "developers/write-playlists",
            },
            {
              type: "doc",
              label: "Albums (Write)",
              id: "developers/write-albums",
            },
            {
              type: "doc",
              label: "Tracks (Write)",
              id: "developers/write-tracks",
            },
            {
              type: "doc",
              label: "Resolve",
              id: "developers/resolve-api",
            },
            {
              type: "doc",
              id: "developers/sdk-oauth-methods",
            },
            {
              type: "category",
              label: "Full Reference",
              items: [
                {
                  type: "category",
                  label: "Interfaces",
                  items: [
                    {
                      type: "doc",
                      label: "UploadTrackMetadata",
                      id: "developers/uploadTrackMetadata",
                    },
                    {
                      type: "doc",
                      label: "WriteOptions",
                      id: "developers/writeOptions",
                    },
                    {
                      type: "autogenerated",
                      dirName: "developers/sdk/interfaces",
                    },
                  ],
                },
                {
                  type: "category",
                  label: "Enums",
                  items: [
                    {
                      type: "autogenerated",
                      dirName: "developers/sdk/enums",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "doc",
          id: "developers/log-in-with-audius",
        },
      ],
    },
  ],
};
