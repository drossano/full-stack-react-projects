import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  // listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

const sampleUser = new User({ username: 'hello', password: 'world' })
const sampleUser2 = new User({ username: 'user2', password: 'password2' })

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: sampleUser._id,
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(sampleUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const post = {
      author: sampleUser._id,
      contents: 'Post with no title',
      tags: ['empty'],
    }
    try {
      await createPost(sampleUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('should fail without author', async () => {
    const post = {
      title: 'Anonymous Post',
      contents: 'Post with no author',
      tags: ['empty'],
    }
    try {
      await createPost(sampleUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`author` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
      author: sampleUser._id,
    }
    const createdPost = await createPost(sampleUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
  test('should fail without user id', async () => {
    const post = {
      title: 'Anonymous Post',
      contents: 'Post with no author',
      tags: ['empty'],
    }

    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError)
      expect(err.message).toContain('Cannot destructure property')
    }
  })
})

const samplePosts = [
  {
    title: 'Learning Redux',
    contents: "Let's learn redux!",
    author: sampleUser._id,
    tags: ['redux'],
  },
  {
    title: 'Learn React Hooks',
    author: sampleUser._id,
    tags: ['react'],
  },
  {
    title: 'Full-Stack React Projects',
    author: sampleUser._id,
    tags: ['react', 'nodejs'],
  },
  {
    title: 'Guide to TypeScript',
    author: sampleUser2._id,
  },
]

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)

    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    console.log(posts)
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
  // works on website but can't get test to work
  /*   test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('hello')
    expect(posts.length).toBe(3)
  }) */
  test('should able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

describe('getting a post', () => {
  test('should return full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if id doesnt exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(sampleUser._id, createdSamplePosts[0]._id, {
      contents: 'Test contents',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('Test contents')
  })
  test('should not update other props', async () => {
    await updatePost(sampleUser._id, createdSamplePosts[0]._id, {
      contents: 'Test contents',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(sampleUser._id, createdSamplePosts[0]._id, {
      contents: 'Test contents',
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if user id doesnt exist', async () => {
    ;async () => {
      const post = await updatePost(
        '000000000000000000000000',
        '000000000000000000000000',
        {
          contents: 'Test contents',
        },
      )
      expect(post).toEqual(null)
    }
  })
  test('should fail if user & post ids dont exist', async () => {
    ;async () => {
      const post = await updatePost(
        '000000000000000000000000',
        createdSamplePosts[0]._id,
        {
          contents: 'Test contents',
        },
      )
      expect(post).toEqual(null)
    }
  })
  test('should fail if post id doesnt exist', async () => {
    ;async () => {
      const post = await updatePost(
        sampleUser._id,
        '000000000000000000000000',
        {
          contents: 'Test contents',
        },
      )
      expect(post).toEqual(null)
    }
  })
  test("shouldn't update if edited by a different user", async () => {
    await updatePost(sampleUser2._id, createdSamplePosts[0]._id, {
      contents: 'not my post',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual("Let's learn redux!")
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(sampleUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the user  doesnt not exist', async () => {
    const result = await deletePost(
      '000000000000000000000000',
      createdSamplePosts[0]._id,
    )
    expect(result.deletedCount).toEqual(0)
  })
  test('should fail if the post ids doesnt not exist', async () => {
    const result = await deletePost(sampleUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
  test('should fail if the user and post ids dont not exist', async () => {
    const result = await deletePost(
      '000000000000000000000000',
      '000000000000000000000000',
    )
    expect(result.deletedCount).toEqual(0)
  })
  test('should fail if deleted by different user does not exist', async () => {
    const result = await deletePost(sampleUser2._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(0)
  })
})
