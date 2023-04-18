<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            ...parent::toArray($request),
            'created_at_diff' => $this->created_at->diffForHumans(),
        ];
    }
}
