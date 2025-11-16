<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'long_description' => $this->long_description,
            'cover_image_url' => $this->cover_image_url,
            'average_rating' => $this->average_rating,
            'price_level' => $this->price_level,
            'locality' => [
                'id' => $this->locality?->id,
                'name' => $this->locality?->name,
                'locality_type' => $this->locality?->locality_type,
            ],
            'province' => [
                'id' => $this->locality?->province?->id,
                'name' => $this->locality?->province?->name,
            ],
            'region' => [
                'id' => $this->locality?->province?->region?->id,
                'name' => $this->locality?->province?->region?->name,
            ],
            'photos' => $this->photos->map(fn ($photo) => [
                'id' => $photo->id,
                'url' => $photo->url,
            ]),
            'comments' => $this->comments->map(fn ($comment) => [
                'id' => $comment->id,
                'body' => $comment->body,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                ],
            ]),
        ];
    }
}