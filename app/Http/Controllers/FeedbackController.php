<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Feedback;
use App\Http\Resources\FeedbackResource;
use App\Http\Requests\FeedbackStoreRequest;

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

    public function index()
    {
        $feedbacksCollection = Feedback::latest()->paginate();
        $feedbacks = FeedbackResource::collection($feedbacksCollection);

        return Inertia::render('Feedback/Index', compact('feedbacks'));
    }

    public function show(Feedback $feedback)
    {
        $feedback = FeedbackResource::make($feedback);

        return Inertia::render('Feedback/Show', compact('feedback'));
    }
}
