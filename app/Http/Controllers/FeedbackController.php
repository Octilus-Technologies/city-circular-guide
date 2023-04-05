<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackStoreRequest;
use App\Models\Feedback;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function create()
    {
        $submissionRoute = route('feedback.store');

        return Inertia::render('Feedback/Contact', compact('submissionRoute'));
    }

    public function store(FeedbackStoreRequest $request)
    {
        $validatedData = $request->validated();

        Feedback::create($validatedData);

        return to_route("welcome")->with('success', __('Thank you for your feedback!'));
    }
}
