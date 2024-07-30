import React, { useState, useRef } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Loader2,
  MoreVertical,
  Trash2,
  ChevronRight,
  FileText,
  Clock,
  User
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { GET_POSTS, DELETE_POST } from '@/graphql/posts';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'now',
    m: '1m',
    mm: '%dm ago',
    h: '1h',
    hh: '%dh ago',
    d: '1d',
    dd: '%dd ago',
    M: '1mo',
    MM: '%dmo ago',
    y: '1y',
    yy: '%dy ago'
  }
});

function truncate(str: string, n: number) {
  return str.length > n ? `${str.substring(0, n - 1)}...` : str;
}

export default function LatestPosts() {
  const { toast } = useToast();
  const idToBeDeleted = useRef<string>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, refetch, error } = useQuery(GET_POSTS, {
    variables: { top: 5 },
    errorPolicy: 'all'
  });

  const [deletePost, { loading: deletePostLoading }] = useMutation(
    DELETE_POST,
    {
      onCompleted() {
        toast({
          title: 'Post deleted',
          description: 'The post has been successfully deleted.'
        });
        refetch();
        setDeleteDialogOpen(false);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
        console.error(error);
      }
    }
  );

  const handleDelete = (postId: string) => {
    deletePost({
      variables: {
        postId: postId
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <div
        className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
        style={{ backgroundSize: '30px 30px' }}
      ></div>
      <Card className="relative bg-transparent shadow-lg">
        <CardHeader className="bg-white/50 backdrop-blur-sm">
          <h4 className="flex items-center text-2xl font-bold text-purple-800">
            <FileText className="mr-2 h-6 w-6" />
            Latest Posts
          </h4>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-purple-700">Post</TableHead>
                <TableHead className="text-purple-700">Created By</TableHead>
                <TableHead className="text-purple-700">Created At</TableHead>
                <TableHead className="text-right text-purple-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="mr-2 inline h-6 w-6 animate-spin text-purple-600" />
                    <span className="font-semibold text-purple-600">
                      Loading posts...
                    </span>
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-red-500"
                  >
                    This content isn't available
                  </TableCell>
                </TableRow>
              )}
              {data && data.posts.edges.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    Sorry, no matching records found
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data.posts.edges.slice(0, 5).map((post: any) => (
                  <TableRow
                    key={post.node.id}
                    className="transition-colors duration-200 hover:bg-white/30"
                  >
                    <TableCell>
                      <Link
                        href={`/admin/school/post/${post.node.id}`}
                        className="transition-colors duration-200 hover:text-purple-600"
                      >
                        {truncate(post.node.text, 40)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage
                            src={
                              post.node.createdBy.user.profilePicture?.signedUrl
                            }
                          />
                          <AvatarFallback className="bg-purple-200 text-purple-800">{`${post.node.createdBy.user.firstName
                            .charAt(0)
                            .toUpperCase()}${post.node.createdBy.user.lastName
                            .charAt(0)
                            .toUpperCase()}`}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-700">
                          {post.node.createdBy.user.firstName}{' '}
                          {post.node.createdBy.user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        {dayjs(post.node.createdAt).fromNow(true)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteDialogOpen(true);
                              idToBeDeleted.current = post.node.id;
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        {data && data.posts.edges.length > 0 && (
          <CardFooter className="flex justify-end bg-white/50 backdrop-blur-sm">
            <Link href="/admin/school/post" passHref>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200"
              >
                See all
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(idToBeDeleted.current!)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePostLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
