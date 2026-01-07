# Technical Architecture - AI Features Implementation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │  AdminView   │  │ StudentView  │  │   StaffView     │    │
│  │  - Insights  │  │  - ETA       │  │ - Completion    │    │
│  │  - Reports   │  │  - Status    │  │ - AI Analysis   │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘    │
│         │                 │                   │              │
│         └─────────────────┼───────────────────┘              │
│                           │                                  │
│         ┌─────────────────▼──────────────────┐              │
│         │    GeminiService (AI Logic)        │              │
│         ├──────────────────────────────────┤              │
│         │ • generateQueueInsights()          │              │
│         │ • predictWaitTime()                │              │
│         │ • predictETAWithHistoricalData()   │              │
│         │ • analyzeOrderCompletion()         │              │
│         │ • generateMenuImage()              │              │
│         └────────────┬──────────┬────────────┘              │
│                      │          │                            │
│         ┌────────────▼──┐  ┌───▼─────────────┐             │
│         │  Google Gemini API (Cloud)        │             │
│         │ • gemini-3-flash-preview          │             │
│         │ • gemini-3-pro-image-preview      │             │
│         └────────────────────────────────────┘             │
│                                                            │
│  ┌─────────────────────────────────────────────────┐     │
│  │     BackendService (Local Data Management)      │     │
│  ├─────────────────────────────────────────────────┤     │
│  │ • createToken()                                 │     │
│  │ • markOrderReady()                              │     │
│  │ • completeOrderWithAI()                         │     │
│  │ • recordOrderHistory()                          │     │
│  │ • getHistoricalDataForFood()                    │     │
│  │ • getStats()                                    │     │
│  │ • getHourlyTraffic()                            │     │
│  └────────────┬──────────────────────────────────┘      │
│               │                                          │
│         ┌─────▼──────────────┐                          │
│         │ Browser localStorage │                          │
│         │  • smartqueue_tokens│                          │
│         │  • smartqueue_history                          │
│         │  • smartqueue_canteens                          │
│         └──────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. ETA Prediction Flow

```
┌─ Student Places Order ──────────────┐
│                                     │
│  placeOrder(canteenId, foodItem)   │
│          │                          │
│          ├─► createToken()          │
│          │   (creates WAITING token)│
│          │                          │
│          ├─► getActiveQueue()       │
│          │   (gets queue length)    │
│          │                          │
│          ├─► getHistoricalDataForFood()
│          │   (retrieves past prep times)
│          │                          │
│          └─► predictETAWithHistoricalData()
│              ├─ Analyze food history
│              ├─ Check peak hour (12-1 PM, 6-7 PM)
│              ├─ Factor in queue length
│              ├─ Call Gemini AI
│              └─ Return { estimatedMinutes, reasoning, isPeakHour }
│                      │
│                      └─► updateTokenEstimation()
│                          (saves ETA + reasoning to token)
│                                 │
│                                 ▼
│                    Student sees ETA on token card
│                    with AI reasoning displayed
│
└─────────────────────────────────────┘
```

### 2. Order Completion with AI Analysis

```
┌─ Staff Marks Order Complete ──────────┐
│                                       │
│  handleComplete(tokenId)              │
│          │                            │
│          ├─► getTokenStatus()         │
│          │   (retrieve token data)    │
│          │                            │
│          ├─► Calculate actualWaitTime │
│          │   = now - token.timestamp  │
│          │                            │
│          └─► analyzeOrderCompletion()
│              ├─ Compare: actual vs estimated
│              ├─ Check: isReadyForPickup
│              ├─ Call: Gemini AI
│              └─ Return { shouldComplete, reasoning }
│                      │
│                      ├─► completeOrderWithAI()
│                      │   │
│                      │   ├─ Set status = COMPLETED
│                      │   ├─ Set completedAt = now
│                      │   ├─ Add AI reasoning
│                      │   │
│                      │   └─► recordOrderHistory()
│                      │       ├─ Calculate prepTime
│                      │       ├─ Extract hour of day
│                      │       └─ Store in history
│                      │              │
│                      └─────────────┤
│                                    │
│                                    ▼
│                    Order marked COMPLETED
│                    Student sees "Completed" badge
│                    History data added for ML
│
└────────────────────────────────────┘
```

### 3. Historical Data Usage

```
┌─ Over Time: Building ML Model ───────┐
│                                      │
│  Order 1: Masala Dosa @ 12:30 PM    │
│  └─► recordOrderHistory()            │
│      { foodItem: "Masala Dosa",     │
│        prepTimeMinutes: 12,          │
│        hour: 12 }                    │
│                                      │
│  Order 2: Masala Dosa @ 3:45 PM     │
│  └─► recordOrderHistory()            │
│      { foodItem: "Masala Dosa",     │
│        prepTimeMinutes: 8,           │
│        hour: 15 }                    │
│                                      │
│  Order 3: Cold Coffee @ 12:15 PM    │
│  └─► recordOrderHistory()            │
│      { foodItem: "Cold Coffee",     │
│        prepTimeMinutes: 4,           │
│        hour: 12 }                    │
│                                      │
│  ... (more orders) ...               │
│                                      │
│  When next student orders:           │
│  ├─► getHistoricalDataForFood()     │
│  │   Returns all past Masala Dosa   │
│  │   orders with their times        │
│  │                                   │
│  └─► AI calculates:                 │
│      • Average prep: 10 min          │
│      • Peak vs off-peak patterns     │
│      • Contextual ETA estimate       │
│                                      │
└──────────────────────────────────────┘
```

## Key Algorithms

### Peak Hour Detection Algorithm
```typescript
function isPeakHour(hour: number): boolean {
  // Lunch: 12-1 PM
  // Dinner: 6-7 PM
  return (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 19);
}

function getEtaMultiplier(hour: number): number {
  return isPeakHour(hour) ? 1.4 : 1.0; // 40% increase during peak
}
```

### Historical Data Aggregation
```typescript
function calculateAvgPrepTime(foodItem: string, history: OrderRecord[]): number {
  const itemRecords = history.filter(r => r.foodItem === foodItem);
  
  if (itemRecords.length === 0) return 8; // Default 8 min
  
  const total = itemRecords.reduce((sum, r) => sum + r.prepTimeMinutes, 0);
  return Math.round(total / itemRecords.length);
}
```

### ETA Calculation Formula
```
basePrepTime = averageHistoricalPrepTime(foodItem)
queueWaitTime = queueLength × 2.5 minutes per person
peakMultiplier = isPeakHour(currentHour) ? 1.4 : 1.0

finalETA = (basePrepTime + queueWaitTime) × peakMultiplier
```

### Example:
- Food: Masala Dosa (avg 8 min historical)
- Queue: 5 people
- Time: 12:30 PM (peak hour)
- Calculation:
  - Base: 8 min
  - Queue: 5 × 2.5 = 12.5 min
  - Subtotal: 20.5 min
  - Peak multiplier: 1.4
  - **Final ETA: 20.5 × 1.4 = 29 minutes**

## API Integration

### Gemini API Calls

#### 1. generateQueueInsights()
```
Model: gemini-3-flash-preview
Input: QueueStats { totalOrdersToday, averageWaitTime, peakHour, activeQueueLength }
Output: String (markdown bullet points with insights)
Context: Admin dashboard report generation
```

#### 2. predictWaitTime()
```
Model: gemini-3-flash-preview
Input: 
  - queueLength: number
  - foodItem: string
  - currentTime: { day, time }
  - averageWaitTime: number
Output: { estimatedMinutes, reasoning }
Context: Fallback ETA prediction
```

#### 3. predictETAWithHistoricalData()
```
Model: gemini-3-flash-preview
Input:
  - foodItem: string
  - queueLength: number
  - historicalData: Array<{ foodItem, prepTimeMinutes, hour }>
  - currentHour: number
Output: { estimatedMinutes, reasoning, isPeakHour }
Context: Smart ETA with history awareness
```

#### 4. analyzeOrderCompletion()
```
Model: gemini-3-flash-preview
Input:
  - foodItem: string
  - estimatedWaitMinutes: number
  - actualWaitMinutes: number
  - isReadyForPickup: boolean
Output: { shouldComplete, reasoning }
Context: AI-driven order completion decision
```

#### 5. generateMenuImage()
```
Model: gemini-3-pro-image-preview
Input: Prompt (food description)
Output: Base64 image data
Context: Food item visualization
```

## Local Storage Structure

### smartqueue_tokens
```typescript
interface Token {
  id: string;                          // Unique identifier
  canteenId: string;                   // Which canteen
  couponCode: string;                  // Ticket hash
  tokenNumber: string;                 // Display number (A-001)
  foodItem: string;                    // What was ordered
  status: OrderStatus;                 // WAITING | READY | COMPLETED
  timestamp: number;                   // When ordered (milliseconds)
  estimatedWaitTimeMinutes: number;    // AI-predicted wait time
  aiReasoning?: string;                // Why system estimated this time
  completedAt?: number;                // When order was completed
}
```

### smartqueue_history
```typescript
interface HistoryRecord {
  id: string;                    // Record identifier
  foodItem: string;              // What was ordered
  prepTimeMinutes: number;       // How long it took
  hour: number;                  // What hour it was (0-23)
  timestamp: number;             // When recorded
}
```

### smartqueue_canteens
```typescript
interface Canteen {
  id: string;                    // Canteen identifier
  name: string;                  // Display name
  campus: string;                // Location
  themeColor: string;            // Gradient CSS classes
}
```

## Error Handling & Fallbacks

### Missing API Key
```
- generateQueueInsights() → Returns "API unavailable" message
- predictETAWithHistoricalData() → Falls back to queue-based calculation
- analyzeOrderCompletion() → Uses simple time threshold
- generateMenuImage() → Returns null
```

### API Request Failures
```
- Retry logic: Immediate fallback, no retry loop
- Graceful degradation: Always return valid response
- User notification: Error messages shown to appropriate user role
- Data consistency: LocalStorage always updated regardless of API
```

### Data Validation
```
- Token validation: Check canteenId, foodItem, status
- History validation: Ensure prepTimeMinutes is positive
- Statistics validation: Calculate safely with zero division checks
```

## Performance Considerations

### Storage Management
- History limited to 1000 most recent records
- Prevents localStorage bloat
- FIFO removal when limit exceeded

### Query Optimization
- Filter operations use array methods (.filter, .find)
- History queries filter by foodItem immediately
- Stats calculated on-demand, not cached

### UI Rendering
- Insights report cached in component state
- Token updates trigger re-renders only when needed
- Historical data fetched async, UI shows loading state

## Security Notes

### API Key Protection
- Used only server-side or environment variables
- Never exposed in client code
- Fallbacks work without key

### Data Privacy
- All data stored locally in browser
- No external data transmission except to Gemini API
- User can clear localStorage anytime

### Input Validation
- Food item names validated before querying
- Queue length verified to be non-negative
- Timestamps validated as valid numbers

## Testing Strategy

### Unit Tests Recommended
- Historical data recording and retrieval
- ETA calculation algorithms
- Peak hour detection logic
- Status transitions

### Integration Tests Recommended
- Full order flow (create → ready → complete)
- AI insight generation with sample data
- Historical data accumulation over time
- API fallback mechanisms

### Manual Testing Checklist
- [ ] Generate insights with various queue states
- [ ] Place orders during peak hours (12-1 PM, 6-7 PM)
- [ ] Mark orders complete and verify history recording
- [ ] Test without API key (graceful degradation)
- [ ] Check localStorage for data persistence
- [ ] Verify UI updates in real-time
- [ ] Test with network disconnected
