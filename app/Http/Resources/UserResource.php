<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        // * Filter out sensitive data

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'avatar' => $this->avatar,
            'is_admin' => $this->is_admin,
            'created_at' => $this->created_at,
            'created_at_diff' => $this->created_at->diffForHumans(),
        ];
    }
}
