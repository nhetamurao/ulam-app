<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LocalityResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'psgc_code'     => $this->psgc_code,
            'province_id'   => $this->province_id,
            'locality_type' => $this->locality_type,
        ];
    }
}