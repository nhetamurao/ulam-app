<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShopPhoto;
use App\Http\Resources\ShopPhotoResource;
use Illuminate\Http\Request;

class ShopPhotoController extends Controller
{
    public function index($shop_id)
    {
        $photos = ShopPhoto::where('shop_id', $shop_id)->get();
        return ShopPhotoResource::collection($photos);
    }

    public function store(Request $request, $shop_id)
    {
        // Validation omitted; assumes file_url passed in request
        $photo = ShopPhoto::create([
            'shop_id'     => $shop_id,
            'file_url'    => $request->file_url,
            'caption'     => $request->caption,
            'is_featured' => $request->is_featured ?? 0,
        ]);
        return new ShopPhotoResource($photo);
    }

    public function destroy($shop_id, $photo_id)
    {
        $photo = ShopPhoto::where('shop_id', $shop_id)->findOrFail($photo_id);
        $photo->delete();
        return response()->json(['message' => 'Deleted'], 204);
    }
}