<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LikeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'user_id'    => $this->user_id,
            'shop_id'    => $this->shop_id,
            'created_at' => $this->created_at,
        ];
    }
}