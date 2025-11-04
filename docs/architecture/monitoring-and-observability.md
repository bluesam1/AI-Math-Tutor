# Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** CloudWatch Logs for frontend errors (via API errors)
- **Backend Monitoring:** CloudWatch Logs and Metrics for Lambda functions
- **Error Tracking:** CloudWatch Logs with error aggregation
- **Performance Monitoring:** CloudWatch Metrics for Lambda duration, API Gateway latency

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (via error boundary)
- API response times
- User interactions (button clicks, form submissions)
- Developer testing interface usage (development only): test scenarios run, test results, answer detection accuracy

**Backend Metrics:**
- Request rate (API Gateway)
- Error rate (4xx, 5xx responses)
- Response time (Lambda duration + API Gateway latency)
- External API usage (OpenAI Vision API, LLM API calls)
- Developer testing metrics (development only): scenarios run, test execution time, Socratic compliance rate
