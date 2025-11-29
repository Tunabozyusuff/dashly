import { useState, useEffect } from 'react'

export interface Post {
    id: number
    title: string
    body: string
    tags: string[]
    reactions: {
        likes: number
        dislikes: number
    }
    views: number
    userId: number
    username?: string
}

interface PostsResponse {
    posts: Post[]
    total: number
    skip: number
    limit: number
}

interface User {
    id: number
    username: string
}

interface UsersResponse {
    users: User[]
}

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)

                // Fetch posts and users in parallel
                const [postsResponse, usersResponse] = await Promise.all([
                    fetch('https://dummyjson.com/posts'),
                    fetch('https://dummyjson.com/users?limit=0') // Fetch ALL users
                ])

                if (!postsResponse.ok || !usersResponse.ok) {
                    throw new Error('Failed to fetch data')
                }

                const postsData: PostsResponse = await postsResponse.json()
                const usersData: UsersResponse = await usersResponse.json()

                console.log('📦 Fetched users:', usersData.users.slice(0, 3))
                console.log('👥 Total users fetched:', usersData.users.length)

                // Create a map of userId to username
                const userMap = new Map(
                    usersData.users.map(user => [user.id, user.username])
                )

                console.log('🗺️ User map sample:', Array.from(userMap.entries()).slice(0, 3))

                // Merge username into posts
                const postsWithUsernames = postsData.posts.map(post => ({
                    ...post,
                    username: userMap.get(post.userId) || `User ${post.userId}`
                }))

                // Check for missing usernames
                const missingUsers = postsWithUsernames.filter(p => !userMap.has(p.userId))
                if (missingUsers.length > 0) {
                    console.warn('⚠️ Posts with missing users:', missingUsers.map(p => ({ postId: p.id, userId: p.userId })))
                }

                console.log('✅ Posts with usernames:', postsWithUsernames.slice(0, 2))

                setPosts(postsWithUsernames)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return { posts, loading, error }
}
