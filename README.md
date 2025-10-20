# Quiz Web Application

A senior-level quiz application built with React, Next.js, and TailwindCSS featuring comprehensive state management, deterministic question shuffling, timed quizzes, and robust error handling.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd quiz-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + Next.js 15 (App Router)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Testing**: Jest + ts-jest
- **State Management**: Custom useReducer hook

### Architecture Decisions

#### App Router vs Pages Router
**Chosen**: App Router
- **Rationale**: App Router provides better performance, improved developer experience, and future-proof architecture
- **Benefits**: 
  - Server Components by default
  - Improved loading states and error boundaries
  - Better SEO with metadata API
  - Simplified routing with file-based structure

#### Node vs Edge Runtime
**Chosen**: Node Runtime (default)
- **Rationale**: For this quiz application, Node runtime provides sufficient performance and better compatibility
- **Considerations**: Edge runtime could be used for API routes if global distribution becomes a requirement

#### State Management Approach
**Chosen**: Custom useReducer hook
- **Rationale**: Avoided external state management libraries (Redux, Zustand) for simplicity
- **Benefits**:
  - No additional dependencies
  - Type-safe state management
  - Predictable state updates
  - Easy to test and debug
- **Implementation**: Centralized state management with computed values and action creators

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── quiz/          # Quiz data endpoint
│   │   └── grade/         # Grading endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main quiz application
├── components/             # Reusable UI components
│   ├── AnswerInput.tsx    # Question input components
│   ├── ProgressBar.tsx    # Progress indicators
│   ├── QuestionCard.tsx   # Question display
│   ├── QuestionReview.tsx # Results review
│   └── QuizResults.tsx    # Results display
├── hooks/                  # Custom React hooks
│   └── useQuizState.ts    # Quiz state management
├── types/                  # TypeScript type definitions
│   └── quiz.ts            # Quiz-related types
└── utils/                  # Utility functions
    ├── quizUtils.ts       # Core quiz logic
    └── __tests__/         # Unit tests
```

## 🔧 Features Implemented

### Core Requirements ✅
- **Frontend**: React + Next.js + TailwindCSS with App Router
- **API Integration**: Fetch from `/api/quiz` and POST to `/api/grade`
- **Question Types**: Text, Radio, Checkbox support
- **Loading States**: Comprehensive loading and error handling
- **UI Styling**: Modern, responsive design with TailwindCSS

### Bonus Features ✅
1. **Deterministic Question/Choice Shuffling**
   - Fisher-Yates algorithm with seed-based randomization
   - Consistent question order across sessions
   - Shuffled answer options for multiple choice questions

2. **Timed Quiz**
   - 5-minute time limit with countdown timer
   - Automatic submission when time expires
   - Visual timer with color-coded warnings

3. **Unit Tests**
   - Comprehensive test coverage for grading logic
   - Utility function testing
   - Jest configuration with TypeScript support

4. **Custom State Management**
   - useReducer-based state management
   - Type-safe actions and computed values
   - Predictable state transitions

## 🛡️ Validation Approach

### Client-Side Validation
- Form input validation for all question types
- Real-time answer validation
- Navigation state management

### Server-Side Validation
- Request payload validation
- Quiz submission integrity checks
- Duplicate question ID detection
- Time spent validation

### Error Handling
- Comprehensive error boundaries
- Graceful API failure handling
- User-friendly error messages
- Retry mechanisms for failed requests

## 📚 Libraries Used & Rationale

### Core Dependencies
- **Next.js 15**: Modern React framework with App Router
- **React 19**: Latest React with improved performance
- **TypeScript**: Type safety and developer experience
- **TailwindCSS 4**: Utility-first CSS framework

### Development Dependencies
- **Jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **ESLint**: Code linting and formatting

### Rationale for Library Choices
- **No external state management**: Custom useReducer provides sufficient functionality
- **No UI component library**: TailwindCSS provides all styling needs
- **Minimal dependencies**: Focus on core functionality without bloat

## ⚖️ Trade-offs & Shortcuts

### Trade-offs Made
1. **Mock Data Only**: No external database for simplicity
   - **Impact**: Limited scalability for production use
   - **Benefit**: Faster development and easier deployment

2. **Client-Side Timer**: Timer runs in browser
   - **Impact**: Timer can be manipulated by users
   - **Benefit**: Simpler implementation, no server-side complexity

3. **In-Memory Grading**: Grading logic runs on server without persistence
   - **Impact**: No historical data or analytics
   - **Benefit**: Stateless, scalable architecture

4. **Single Quiz**: Only one quiz configuration
   - **Impact**: Limited flexibility for different quiz types
   - **Benefit**: Focused, polished user experience

### Shortcuts Taken
1. **No Authentication**: Skipped user management for simplicity
2. **No Data Persistence**: Results not stored between sessions
3. **Fixed Question Set**: Hardcoded quiz questions
4. **No Offline Support**: Requires internet connection

## ⏱️ Time Spent

**Total Development Time**: ~8 hours

### Breakdown:
- **Planning & Architecture**: 1 hour
- **TypeScript Types & API Design**: 1 hour
- **API Implementation**: 1.5 hours
- **State Management**: 1 hour
- **UI Components**: 2 hours
- **Testing**: 1 hour
- **Documentation**: 0.5 hours

## 🧪 Testing Strategy

### Unit Tests
- **Coverage**: Core utility functions and grading logic
- **Framework**: Jest with TypeScript support
- **Test Cases**: 26 test cases covering all major functionality

### Test Categories
- Text normalization and comparison
- Array equality checking
- Question grading logic (all question types)
- Submission validation
- Deterministic shuffling algorithm

## 🚀 Deployment Considerations

### Production Readiness
- **Build Optimization**: Next.js production build
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Optimized bundle size
- **Accessibility**: Semantic HTML and ARIA labels

### Scalability Notes
- **API Routes**: Can be easily moved to Edge Runtime
- **State Management**: Can be replaced with external solution
- **Database**: Can be integrated with any database solution
- **Authentication**: Can be added with NextAuth.js or similar

## 🔮 Future Enhancements

### Potential Improvements
1. **Database Integration**: PostgreSQL or MongoDB for persistent data
2. **User Authentication**: NextAuth.js for user management
3. **Question Management**: Admin interface for quiz creation
4. **Analytics**: Detailed performance tracking
5. **Offline Support**: Service worker implementation
6. **Real-time Features**: WebSocket integration for live quizzes

## 📝 License

This project is created for demonstration purposes. Please ensure appropriate licensing for production use.

---

**Built with ❤️ using React, Next.js, and TailwindCSS**
