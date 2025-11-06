# Testing Auto-Prompting Flow

## Expected Flow

### Step 1: Submit an Answer
1. Set a math problem (e.g., "Solve for x: 2x + 3 = 11")
2. In the chat, type an answer that looks like an answer:
   - Simple numbers: `5`, `42`, `3.14`
   - Algebraic: `x = 5`, `x = 4`
   - Direct answer: `the answer is 5`, `answer: 4`
   - Question format: `Is it 5?`

### Step 2: Answer Detection (Immediate)
- The system should detect your message as an answer
- Check browser console for: `[ChatPanel] Starting answer detection`
- Check for: `[ChatPanel] Detected potential answer, checking with API...`

### Step 3: Answer Validation (~1-2 seconds)
- The answer is validated via API
- Check browser console for: `[ChatPanel] Answer check API call successful`
- Check for: `[ChatPanel] Triggering follow-up generation`

### Step 4: Follow-Up Message (Immediate after validation)
- A follow-up message should appear automatically in the chat
- Examples:
  - Correct: "That's correct! 🎉 Can you walk me through how you got that answer?"
  - Incorrect: "Thanks for trying! Let's work through this together. What information do we have?"
  - Partial: "You're on the right track! What's the next step?"

### Step 5: Help Offer Card (7.5 seconds after follow-up)
- After 7.5 seconds, a help offer card should appear below the follow-up message
- Card shows: "Need help breaking this down? I can guide you step-by-step!"
- With buttons: "Yes, please!" and "Not now"

## Troubleshooting

### If answer detection isn't working:
- Check if your message matches the patterns (see `answerDetection.ts`)
- Try a simple number like `5` or `x = 5`
- Check browser console for detection logs

### If follow-up message isn't appearing:
- Check browser console for `[ChatPanel] Follow-up message generated`
- Check network tab for `/api/chat/follow-up` request
- Verify `shouldGenerateFollowUp: true` in answer check response

### If help offer card isn't appearing:
- Check browser console for `[ChatPanel] Triggering help offer timer`
- Check browser console for `[ChatPanel] Showing help offer card after delay`
- Verify the follow-up message was detected (check logs)

## Testing Commands

Try these test messages in chat:
- `5` (should detect as numerical answer)
- `x = 5` (should detect as algebraic answer)
- `the answer is 5` (should detect as direct answer)
- `Is it 5?` (should detect as question-formatted answer)


