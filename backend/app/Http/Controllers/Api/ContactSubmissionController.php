<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    public function store(StoreContactSubmissionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();
        
        ContactSubmission::create($data);
        
        return response()->json([
            'message' => 'Pesan Anda berhasil dikirim. Terima kasih!'
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = ContactSubmission::query()->latest();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $submissions = $query->paginate(20);
        
        return response()->json($submissions);
    }

    public function update(Request $request, ContactSubmission $contactSubmission): JsonResponse
    {
        $contactSubmission->update($request->only('status', 'replied_at'));
        return response()->json(['data' => $contactSubmission]);
    }

    public function destroy(ContactSubmission $contactSubmission): JsonResponse
    {
        $contactSubmission->delete();
        return response()->json(['message' => 'Contact submission deleted']);
    }
}
