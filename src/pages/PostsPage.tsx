import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import BoringAvatar from "boring-avatars"
import { usePosts } from "@/hooks/usePosts"
import { Skeleton } from "@/components/ui/skeleton"
import { IconThumbUp, IconThumbDown, IconEye } from "@tabler/icons-react"

export default function PostsPage() {
    const { posts, loading, error } = usePosts()

    // Debug: Check if usernames are loaded
    console.log('Posts data:', posts.slice(0, 2))

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between py-4">
                        <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
                    </div>

                    {error && (
                        <div className="text-red-500">
                            Error: {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="flex flex-col">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <Skeleton className="h-20 w-full" />
                                    </CardContent>
                                    <CardFooter>
                                        <Skeleton className="h-4 w-1/4" />
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            posts.map((post) => (
                                <Card key={post.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Avatar>
                                                <BoringAvatar
                                                    name={post.username || `User ${post.userId}`}
                                                    variant="beam"
                                                    colors={["#ff0000", "#0000ff"]}
                                                    size={40}
                                                />
                                            </Avatar>
                                            <div className="text-sm text-muted-foreground font-medium">
                                                {post.username || `User ${post.userId}`}
                                            </div>
                                        </div>
                                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {post.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground line-clamp-4">
                                            {post.body}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <IconThumbUp className="size-4" />
                                                {post.reactions.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IconThumbDown className="size-4" />
                                                {post.reactions.dislikes}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <IconEye className="size-4" />
                                            {post.views}
                                        </span>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
