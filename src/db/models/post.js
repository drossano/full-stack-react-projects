import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true }
);

export const Post = mongoose.model("post", postSchema);

const samplePosts = [
  {
    title: "Learning Redux",
    author: "Daniel Bugl",
    tags: ["redux"],
  },
  {
    title: "Learn React Hooks",
    author: "Daniel Bugl",
    tags: ["react"],
  },
  {
    title: "Full-Stack React Projects",
    author: "Daniel Bugl",
    tags: ["react", "nodejs"],
  },
  {
    title: "Guide to TypeScript",
  },
];
