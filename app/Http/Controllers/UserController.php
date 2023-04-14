<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index()
    {
        $usersCollection = User::query()->latest()->paginate();
        $users = UserResource::collection($usersCollection); // * safe to use in frontend

        return Inertia::render('Users/Index', compact('users'));
    }

    public function show(User $user)
    {
        $user = new UserResource($user); // * safe to use in frontend

        return Inertia::render('Users/Show', compact('user'));
    }
}
