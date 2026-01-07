# SmartQueue AI Features - Quick Reference

## For Admin Users 📊

### Generating AI Insights Report
1. Go to the Admin Dashboard
2. Locate the **"Gemini Intelligence"** card on the right sidebar
3. Click **"Generate Report"** button
4. The AI will analyze:
   - Total orders today
   - Average wait times
   - Active queue length
   - Peak hour patterns
5. Report displays actionable insights and recommendations

**Status Indicators:**
- ✅ Green border & text = Report generated successfully
- ❌ Red border & text = Report generation failed (check API key)

---

## For Students 👨‍🎓

### Ordering Food with AI-Enhanced ETA
1. Select a food item from the menu
2. Click **"Confirm Order"** or **"Scan QR to Join Queue"**
3. Your token displays with:
   - **Position**: Your position in the queue
   - **Est. Wait**: AI-calculated time (considers peak hours & historical data)
   - **AI Reasoning**: Why the system predicted this time

**How ETA is Calculated:**
- Historical preparation time for that food
- Current queue length
- Peak hour multiplier (30-50% increase during 12-1 PM or 6-7 PM)
- Day of week patterns

### Tracking Your Order Status
Your token card shows three possible states:

1. **WAITING** (Default) - Order in queue
   - Shows estimated wait time and AI reasoning
   - Queue position visible

2. **READY FOR PICKUP** (Green badge) - Order ready!
   - Pick up your food at the counter
   - Est. wait shows "0m"

3. **COMPLETED** (Emerald badge) - Order fulfilled
   - Staff confirmed order delivery/pickup
   - Final status

---

## For Staff/Kitchen 👨‍🍳

### Processing Orders with AI Completion
1. View all active orders in **Kitchen Display System**
2. When food is ready, click **"Mark Ready"**
3. When customer picks up, click **"Complete Order"**

**AI-Powered Completion:**
- System analyzes actual vs. estimated wait time
- Provides AI reasoning for completion decision
- Records data for future ETA predictions
- Shows helpful notes about order efficiency

**What Gets Recorded:**
- How long the order actually took to prepare
- What time of day it was ordered
- Food item type
- This data improves predictions for similar orders

---

## Peak Hour Times 🕐

The system automatically detects peak hours:
- **Lunch Rush**: 12:00 PM - 1:00 PM
- **Dinner Rush**: 6:00 PM - 7:00 PM

During these times:
- ETAs increase by 30-50%
- Historical patterns heavily considered
- Staffing recommendations may appear in reports

---

## API Key Configuration 🔑

To enable AI features:
1. Get your Gemini API key from Google AI Studio
2. Set environment variable: `API_KEY=your_key_here`
3. Restart the application

**Without API Key:**
- Basic queue management still works
- ETA uses simple queue-length calculation
- Admin insights unavailable
- No peak hour awareness

---

## Historical Data Building 📈

The system learns from every completed order:
- Each order builds a profile for that food item
- Peak hour patterns identified automatically
- Preparation time averages calculated
- Recommendations improve over time

**How to maximize AI accuracy:**
- Keep system running for several days
- Ensure staff consistently mark orders as complete
- Allow diversity in ordering patterns
- Monitor system during different peak hours

---

## Troubleshooting 🔧

### AI Insights Report Not Generating
- ❌ Check if API_KEY environment variable is set
- ❌ Verify Gemini API is enabled
- ❌ Ensure no network connectivity issues
- ✅ System will show error message with details

### ETA Seems Wrong
- First few orders may be inaccurate (building history)
- Check if it's peak hour (system adjusts predictions)
- Review AI reasoning displayed on token card
- More orders = more accurate predictions

### "Completed" Status Not Showing
- Ensure order is marked as READY first
- Staff must click "Complete Order" to finalize
- Check browser console for any errors
- Clear localStorage and refresh if stuck

---

## Data Storage Location 💾

All data stored locally in browser localStorage:
- `smartqueue_tokens` - Active and completed orders
- `smartqueue_coupons` - Coupon/ticket data
- `smartqueue_canteens` - Registered canteens
- `smartqueue_history` - Historical order data for ETA predictions

Data persists across browser sessions and refreshes.

---

## Best Practices 💡

1. **For Admins:**
   - Generate reports during slow periods
   - Use insights to optimize staffing
   - Monitor peak hour trends over time

2. **For Students:**
   - Check ETA before getting in line
   - Peak hours have longer waits (expected)
   - Follow AI reasoning for time estimates

3. **For Kitchen:**
   - Always mark orders as complete
   - This builds accurate prediction models
   - Helps future customers get better ETAs

---

## Feature Capabilities 🚀

| Feature | Requires API Key | Fallback Behavior |
|---------|-----------------|-------------------|
| AI Insights | ✅ Yes | Shows "unavailable" message |
| Smart ETA | ✅ Yes | Uses basic queue calculation |
| Peak Hour Detection | ✅ Yes | Fixed time slots used |
| Order Completion Analysis | ✅ Yes | Simple time threshold |
| Historical Tracking | ❌ No | Always records data |
| Completed Status | ❌ No | Always displays |

---

## Example Scenarios

### Scenario 1: Lunch Rush Order
- Time: 12:30 PM (Peak Hour)
- Food: Masala Dosa
- Queue: 5 people
- Historical Avg: 8 min prep
- **ETA Calculation**: 8 min × 1.4 (peak multiplier) + (5 × 2.5) = 22 minutes
- **AI Reasoning**: "Peak lunch hour + historical prep time for dosas"

### Scenario 2: Afternoon Order
- Time: 3:45 PM (Off-peak)
- Food: Cold Coffee
- Queue: 2 people
- Historical Avg: 4 min prep
- **ETA Calculation**: 4 min + (2 × 2.5) = 9 minutes
- **AI Reasoning**: "Quick prep item, low queue"

### Scenario 3: First Order of New Item
- No historical data exists
- System uses queue-based calculation
- As more orders complete, AI learns and improves

---

## Support & Feedback 📞

For issues or suggestions:
1. Check error messages in browser console
2. Verify API key is properly configured
3. Review localStorage data for corruption
4. Check network connectivity to Gemini API
5. Report issues with reproduction steps
