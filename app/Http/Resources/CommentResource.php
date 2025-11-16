<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'body'       => $this->body ?? $this->content, // if you still keep both
            'created_at' => $this->created_at,

            'user'       => $this->whenLoaded('user', function () {
                return [
                    'id'   => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),

            'shop'       => $this->whenLoaded('shop', function () {
                return [
                    'id'   => $this->shop->id,
                    'name' => $this->shop->name,
                ];
            }),
        ];
    }
}
