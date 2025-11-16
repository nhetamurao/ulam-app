<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * List comments for a given shop.
     * GET /api/shops/{shop_id}/comments
     */
    public function index($shop_id)
    {
        $comments = Comment::with('user')
            ->where('shop_id', $shop_id)
            ->latest()
            ->get();

        return CommentResource::collection($comments);
    }

    /**
     * Store a new comment.
     * POST /api/shops/{shop_id}/comments
     *
     * Requires Santum-authenticated user.
     */
    public function store(Request $request, $shop_id)
    {
        // user must be authenticated via Sanctum
        $user = $request->user();

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        // Use explicit assignment instead of mass-assignment
        $comment = new Comment();
        $comment->shop_id = $shop_id;
        $comment->user_id = $user->id;

        // Your table still has `body` and `content` (and `content` is NOT NULL)
        $comment->body = $validated['body'];        // if you still have this column
        $comment->content = $validated['body'];        // important: to satisfy NOT NULL

        // Optional: only if these columns actually exist in your table
        // $comment->photos_json = $request->input('photos_json', null);
        // $comment->is_flagged  = 0;

        $comment->save();

        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Update a comment.
     * Update /api/comments/{id}
     */
    public function update($id, Request $request)
    {
        $comment = Comment::findOrFail($id);

        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment->body = $validated['body'];
        $comment->content = $validated['body']; // if `content` still exists / is NOT NULL
        $comment->save();

        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Delete a comment.
     * DELETE /api/comments/{id}
     */
    public function destroy($id, Request $request)
    {
        $comment = Comment::findOrFail($id);

        // Only the owner can delete their comment
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Deleted'], 204);
    }

    public function myComments(Request $request)
    {
        $user = $request->user();

        $comments = Comment::with(['shop'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return CommentResource::collection($comments);
    }
}