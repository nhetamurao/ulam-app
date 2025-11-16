<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ShopPhotoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'shop_id'     => $this->shop_id,
            'file_url'    => $this->file_url,
            'caption'     => $this->caption,
            'is_featured' => (bool)$this->is_featured,
        ];
    }
}