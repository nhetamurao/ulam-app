<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProvinceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'psgc_code'  => $this->psgc_code,
            'region_id'  => $this->region_id,
            'localities' => LocalityResource::collection($this->whenLoaded('localities')),
        ];
    }
}