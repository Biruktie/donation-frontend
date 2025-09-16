import { publish } from "gh-pages";

publish(
  "dist", // folder to publish
  {
    branch: "gh-pages",
    repo: "https://github.com/Biruktie/donation-frontend.git",
    dotfiles: true,
  },
  (err) => {
    if (err) console.error(err);
    else console.log("Deployed successfully!");
  }
);
