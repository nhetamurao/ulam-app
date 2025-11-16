<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function count($shop_id)
    {
        $count = Like::where('shop_id', $shop_id)->count();
        return response()->json(['count' => $count]);
    }

    public function like(Request $request, $shop_id)
    {
        Like::firstOrCreate([
            'user_id' => $request->user()->id,
            'shop_id' => $shop_id
        ]);
        return response()->json(['message' => 'Liked'], 201);
    }

    public function unlike(Request $request, $shop_id)
    {
        Like::where([
            'user_id' => $request->user()->id,
            'shop_id' => $shop_id
        ])->delete();
        return response()->json(['message' => 'Unliked'], 204);
    }
}