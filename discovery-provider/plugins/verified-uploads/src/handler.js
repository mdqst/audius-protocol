export default async ({ slack }, db, trackId) => {
  const results = await db("tracks")
    .innerJoin("users", "tracks.owner_id", "=", "users.user_id")
    .select(
      "tracks.title",
      "tracks.mood",
      "tracks.genre",
      "tracks.release_date",
      "tracks.is_premium",
      "tracks.route_id",
      "tracks.owner_id",
      "users.user_id",
      "users.handle",
      "users.name",
      "tracks.track_id",
      "users.is_verified"
    )
    .where("tracks.track_id", "=", trackId)
    .where("users.is_verified", "=", true)
    .first()
    .catch(console.error);

  if (results) {
    console.log(results);
    const {
      title,
      mood,
      release_date,
      is_premium,
      route_id,
      handle,
      name,
      genre,
    } = results;
    const { sendMsg } = slack;
    const header = `:audius-spin: New upload from *${name}* 🔥`;
    const data = {
      Title: title,
      Genre: genre,
      Mood: mood,
      Premium: is_premium,
      Handle: handle,
      Link: `https://audius.co/${route_id}-${trackId}`,
      Release: release_date,
    };
    const payload = formatter(data);
    const msg = `${header} ${payload}`;
    await sendMsg(msg).catch(console.error);
  }
};

const formatter = (data) => {
  const msg = [];
  for (const [key, value] of Object.entries(data)) {
    // omit any null entries of the track
    if (value != null) {
      msg.push(`${key}: ${value}`);
    }
  }
  const inner = msg.join("\n");
  return "```" + inner + "```";
};
