# Clan - Family Social Network App

## Background and Motivation

Clan is a mobile iOS app designed to help families discover and connect with other families in their local area. It's a trust-first, low-friction social network specifically built for parents seeking playdate partners, neighborhood friends, and community support.

**Core Philosophy:**
- Trust & Safety First — Families need to feel secure before connecting
- Low Friction — Busy parents have limited time; every interaction should be purposeful
- Local by Default — Proximity matters; connections should be geographically relevant
- Quality over Quantity — Better to facilitate 3 meaningful connections than 30 shallow ones

**Technical Stack:**
- Framework: React Native with Expo
- Language: TypeScript
- Backend: Supabase (auth, database, real-time, storage)
- Maps: MapKit (iOS native) via react-native-maps
- Push Notifications: Expo Notifications + APNs
- State Management: Zustand
- Styling: NativeWind (Tailwind for React Native)

**MVP Scope (v1.0):**
- ✅ Auth (email + Apple Sign-In)
- ✅ Family profile creation
- ✅ Child profiles
- ✅ Nearby family discovery (map + list)
- ✅ Connection requests
- ✅ Direct messaging
- ✅ Basic notifications
- ✅ Profile editing
- ✅ Block/report
- ❌ Events feature (v1.1)
- ❌ ID verification (future)
- ❌ Background checks (future)
- ❌ Media in messages (future)
- ❌ Group chats (future)
- ❌ Android version (future)

---

## Key Challenges and Analysis

### 1. Location Privacy & Security
**Challenge:** Families need to discover nearby families without exposing exact locations.
**Solution:** 
- Store exact coordinates server-side only
- Calculate distances server-side
- Display blurred/randomized pins on map within `privacy_radius`
- Only show city/neighborhood in UI, never exact addresses
- Implement privacy radius selector (default 500m)

### 2. Trust & Safety
**Challenge:** Building trust in a family-focused social network.
**Solution:**
- Email verification required
- Phone verification encouraged (badge display)
- Report functionality on all profiles
- Block functionality (mutual invisibility)
- Content moderation (auto-flag suspicious patterns)
- Manual review queue for reported content

### 3. Real-time Features
**Challenge:** Real-time messaging and connection updates.
**Solution:**
- Use Supabase real-time subscriptions for:
  - New messages in active conversations
  - New connection requests
  - Connection status updates
- Implement typing indicators
- Handle offline/online states gracefully

### 4. Push Notifications
**Challenge:** Timely, relevant notifications without being intrusive.
**Solution:**
- Deep linking to relevant screens
- Respect user notification preferences
- Include family name but no sensitive details
- Triggers: connection requests, accepted connections, new messages, event reminders

### 5. Performance & Scalability
**Challenge:** Efficiently query nearby families and handle location-based searches.
**Solution:**
- Use PostGIS for efficient geospatial queries in Supabase
- Implement pagination for family discovery
- Cache frequently accessed data (connected families, profile data)
- Optimize map rendering with clustering for dense areas

### 6. Cross-platform Considerations
**Challenge:** iOS-first but with future Android support.
**Solution:**
- Use React Native with Expo for cross-platform foundation
- Use platform-specific components where needed (MapKit for iOS)
- Abstract platform differences in utility functions
- Design system that works across platforms

---

## High-level Task Breakdown

### Phase 1: Foundation & Setup (Weeks 1-2)

#### Task 1.1: Project Initialization
**Success Criteria:**
- Expo project created with TypeScript template
- All dependencies installed and configured
- Project structure matches specification
- ESLint/Prettier configured
- Git repository initialized

**Subtasks:**
- Initialize Expo project: `npx create-expo-app@latest --template`
- Install core dependencies: Supabase client, Zustand, NativeWind, react-native-maps, Expo Notifications
- Set up TypeScript configuration
- Create folder structure (`/app`, `/components`, `/lib`, `/hooks`, `/stores`, `/types`, `/constants`)
- Configure NativeWind (Tailwind CSS for React Native)
- Set up ESLint and Prettier
- Create `.env.example` for environment variables

#### Task 1.2: Supabase Configuration
**Success Criteria:**
- Supabase project created and configured
- Database schema created with all tables
- Row Level Security (RLS) policies implemented
- Edge Functions structure set up
- Storage buckets configured for profile photos

**Subtasks:**
- Create Supabase project
- Design and create database schema:
  - `families` table
  - `children` table
  - `connections` table
  - `conversations` table
  - `messages` table
  - `events` table (for future v1.1)
  - `reports` table
  - `blocks` table
- Enable PostGIS extension for geospatial queries
- Create indexes on location columns and foreign keys
- Set up RLS policies:
  - Families can read nearby families (within privacy radius)
  - Families can only update their own profile
  - Connections visible only to involved families
  - Messages visible only to conversation participants
- Create storage bucket for profile photos with public read access
- Set up Supabase client configuration in app
- Create migration files for schema

#### Task 1.3: Authentication System
**Success Criteria:**
- Email/password authentication working
- Apple Sign-In integrated
- Auth state management with Zustand
- Protected routes implemented
- Email verification flow working

**Subtasks:**
- Configure Supabase Auth
- Implement email/password signup and login
- Integrate Apple Sign-In (Expo AuthSession)
- Create auth store with Zustand
- Build auth screens: `login.tsx`, `signup.tsx`
- Implement protected route wrapper
- Add email verification check
- Handle auth state persistence
- Create auth hooks (`useAuth`, `useSession`)

#### Task 1.4: Navigation Setup
**Success Criteria:**
- Expo Router configured
- Tab navigation working
- Stack navigation for detail screens
- Deep linking structure defined
- Navigation guards in place

**Subtasks:**
- Set up Expo Router with file-based routing
- Create tab navigator structure (`/(tabs)`)
- Create stack navigators for detail screens
- Implement navigation guards (auth required)
- Set up deep linking configuration
- Create navigation types
- Test navigation flow between screens

---

### Phase 2: Core Features - Profiles & Discovery (Weeks 3-4)

#### Task 2.1: Onboarding Flow
**Success Criteria:**
- Complete onboarding flow from welcome to completion
- Family profile creation working
- Child profile creation working
- Location setting with privacy radius
- Interest selection working
- Data persisted to Supabase

**Subtasks:**
- Create welcome screen with value proposition
- Build family profile creation screen:
  - Family name input
  - Photo upload (camera/gallery)
  - Bio textarea (200 char limit)
- Build add children screen:
  - Name input
  - Age picker (years + months)
  - Interest tag selection
  - School age group selector
  - Add multiple children
- Build location setting screen:
  - Auto-detect location (Expo Location)
  - Manual location entry
  - Privacy radius selector (slider: 100m - 2000m)
  - Map preview with blurred pin
- Build interest selection screen:
  - Multi-select tag interface
  - Predefined interest categories
- Create onboarding navigation flow
- Persist all data to Supabase
- Create onboarding progress indicator

#### Task 2.2: Family Profile Management
**Success Criteria:**
- View own family profile
- Edit family profile (name, bio, photo)
- Add/edit/delete children
- Update location and privacy settings
- Changes reflected immediately in UI

**Subtasks:**
- Create family profile view component
- Build profile edit screen
- Implement photo upload/update
- Create child management UI (add/edit/delete)
- Implement location update flow
- Create profile store with Zustand
- Add optimistic updates for better UX
- Handle image uploads to Supabase Storage

#### Task 2.3: Location Services Integration
**Success Criteria:**
- Location permissions requested and handled
- Current location tracked
- Location updates stored in database
- Privacy radius respected in all queries
- Background location updates (optional, future)

**Subtasks:**
- Request location permissions (Expo Location)
- Get current location on app open
- Update location periodically (when app active)
- Create location utility functions
- Implement privacy radius calculation
- Create location store with Zustand
- Handle permission denial gracefully
- Add location accuracy indicators

#### Task 2.4: Nearby Families Discovery
**Success Criteria:**
- Query families within specified radius
- Map view showing blurred family pins
- List view with family cards
- Distance calculations accurate
- Filters working (distance, age, interests)
- Performance optimized (pagination, caching)

**Subtasks:**
- Create Supabase Edge Function for nearby families query
  - Use PostGIS for efficient geospatial queries
  - Respect privacy radius
  - Filter by distance, children ages, interests
  - Return blurred coordinates for map display
- Integrate react-native-maps
- Create map view component with markers
- Implement pin clustering for dense areas
- Create list view component
- Build family card component:
  - Family photo
  - Name
  - Distance display
  - Children summary
  - Shared interests
- Create filter UI (distance slider, age ranges, interests)
- Implement pagination for large result sets
- Add loading states and error handling
- Create `useNearbyFamilies` hook

#### Task 2.5: Family Detail View
**Success Criteria:**
- View other family profiles
- Display all profile information
- Show mutual connections count
- "Wave" button functional
- Report/Block options available

**Subtasks:**
- Create family detail screen (`/family/[id].tsx`)
- Display family information:
  - Photo, name, verification badge
  - Bio
  - Children list with ages and interests
  - Family interests
  - Mutual connections count
- Implement "Wave" button (connection request)
- Add overflow menu with Report/Block options
- Handle blocked families (don't show in discovery)
- Create `useFamily` hook for fetching family data

---

### Phase 3: Social Features - Connections & Messaging (Weeks 5-6)

#### Task 3.1: Connection System
**Success Criteria:**
- Send connection requests ("Wave")
- View pending requests (incoming/outgoing)
- Accept/decline requests
- View connected families
- Connection status updates in real-time

**Subtasks:**
- Create connections table schema (if not done)
- Build connection request API (Supabase Edge Function)
- Create "Wave" button component with optional message
- Build Connections screen with tabs:
  - Pending (incoming/outgoing)
  - Connected
- Create connection request card component
- Implement accept/decline actions
- Create connected families list
- Set up real-time subscription for connection updates
- Create `useConnections` hook
- Add connection store with Zustand
- Handle edge cases (duplicate requests, self-requests)

#### Task 3.2: Messaging System
**Success Criteria:**
- Conversation list displays correctly
- Chat interface functional
- Send/receive messages in real-time
- Unread message indicators
- Typing indicators working
- Message timestamps grouped logically

**Subtasks:**
- Create conversations and messages tables (if not done)
- Build conversation list screen
- Create conversation item component with unread badges
- Build chat screen (`/conversation/[id].tsx`)
- Create message bubble component
- Implement message input with send button
- Set up real-time subscription for new messages
- Implement typing indicators
- Group messages by date/time
- Mark messages as read
- Create `useMessages` hook
- Create `useConversations` hook
- Handle message delivery status
- Add message pagination (load older messages)

#### Task 3.3: Push Notifications
**Success Criteria:**
- Push notifications received for:
  - New connection requests
  - Accepted connections
  - New messages
- Notifications deep link to correct screens
- User can manage notification preferences
- Notifications respect user settings

**Subtasks:**
- Configure Expo Notifications
- Set up APNs (Apple Push Notification service)
- Request notification permissions
- Create notification handler
- Implement deep linking from notifications
- Create notification preferences screen
- Store notification preferences in database
- Send notifications via Supabase Edge Functions or webhooks
- Test notification delivery
- Handle notification badges
- Create notification utility functions

---

### Phase 4: Safety & Polish (Weeks 7-8)

#### Task 4.1: Safety Features
**Success Criteria:**
- Report functionality working
- Block functionality working
- Reported/blocked families hidden from discovery
- Content moderation flags working
- Admin review queue accessible (web dashboard - future)

**Subtasks:**
- Create reports table (if not done)
- Create blocks table (if not done)
- Build report flow UI
- Implement block functionality
- Filter blocked families from all queries
- Filter reported families from discovery (pending review)
- Implement auto-flagging for suspicious patterns:
  - Rapid mass connection requests
  - Inappropriate keywords detection
- Create moderation utility functions
- Add confirmation dialogs for destructive actions

#### Task 4.2: Profile & Settings Screen
**Success Criteria:**
- All profile management features accessible
- Settings organized logically
- Notification preferences working
- Privacy settings functional
- Account management working

**Subtasks:**
- Create profile/settings screen (`/(tabs)/profile.tsx`)
- Build settings sections:
  - Profile editing
  - Children management
  - Notification preferences
  - Privacy settings (location blur, visibility)
  - Block list
  - Account (email/password change)
  - Support & feedback
  - Legal (Terms, Privacy Policy links)
- Implement delete account flow
- Add confirmation for sensitive actions
- Create settings store if needed

#### Task 4.3: UI/UX Polish
**Success Criteria:**
- Design system consistently applied
- All screens match design guidelines
- Animations smooth and purposeful
- Loading states everywhere
- Error states handled gracefully
- Accessibility basics implemented

**Subtasks:**
- Review all screens for design consistency
- Apply color palette throughout:
  - Primary: #1A1A1A
  - Secondary: #7C9082
  - Accent: #E8927C
  - Background: #FAFAF8
  - Surface: #FFFFFF
- Ensure consistent typography (SF Pro)
- Add loading skeletons/spinners
- Create error boundary components
- Implement error toast notifications
- Add success feedback for actions
- Ensure 24px minimum touch targets
- Add subtle animations (spring physics)
- Test on different iOS devices/sizes
- Implement pull-to-refresh where appropriate

#### Task 4.4: Performance Optimization
**Success Criteria:**
- App loads quickly (< 2s initial load)
- Smooth scrolling in lists
- Map performance acceptable
- Images optimized and cached
- No memory leaks
- Efficient database queries

**Subtasks:**
- Optimize image loading and caching
- Implement list virtualization for long lists
- Optimize map marker rendering
- Review and optimize database queries
- Add query result caching where appropriate
- Profile app performance (React DevTools)
- Fix any memory leaks
- Optimize bundle size
- Test on lower-end devices
- Add performance monitoring

#### Task 4.5: Testing & Bug Fixes
**Success Criteria:**
- Critical user flows tested
- No blocking bugs
- Edge cases handled
- Error scenarios tested
- TestFlight build ready

**Subtasks:**
- Write unit tests for utility functions
- Write integration tests for key flows:
  - Onboarding
  - Connection request
  - Messaging
- Manual testing of all features
- Test on multiple iOS versions
- Test on different device sizes
- Fix identified bugs
- Test error scenarios (network failures, etc.)
- Test offline behavior
- Create test user accounts
- Document known issues/limitations

---

### Phase 5: Launch Preparation (Week 9)

#### Task 5.1: App Store Assets
**Success Criteria:**
- All required assets created
- App Store listing complete
- Privacy Policy and Terms published
- App Preview video created (if planned)

**Subtasks:**
- Create app icon (all required sizes)
- Design and create screenshots for all device sizes
- Write App Store description
- Write App Store keywords
- Create app preview video (optional)
- Publish Privacy Policy (web)
- Publish Terms of Service (web)
- Set up App Store Connect listing
- Configure in-app purchases (if any)
- Set age rating (4+)

#### Task 5.2: TestFlight Beta
**Success Criteria:**
- TestFlight build submitted
- Beta testers invited
- Feedback collected and prioritized
- Critical issues fixed

**Subtasks:**
- Create TestFlight build
- Submit for beta review
- Invite beta testers
- Set up feedback collection mechanism
- Monitor crash reports
- Fix critical bugs from beta feedback
- Iterate based on feedback
- Prepare final production build

#### Task 5.3: Final Production Build
**Success Criteria:**
- Production build created
- All tests passing
- App Store submission ready
- Monitoring/logging in place

**Subtasks:**
- Create production build
- Final testing pass
- Set up error tracking (Sentry or similar)
- Set up analytics (optional, privacy-conscious)
- Prepare App Store submission
- Submit for App Store review
- Monitor submission status
- Respond to review feedback if needed

---

## Project Status Board

### Phase 1: Foundation & Setup
- [x] Task 1.1: Project Initialization ✅
- [ ] Task 1.2: Supabase Configuration
- [ ] Task 1.3: Authentication System
- [ ] Task 1.4: Navigation Setup

### Phase 2: Core Features - Profiles & Discovery
- [ ] Task 2.1: Onboarding Flow
- [ ] Task 2.2: Family Profile Management
- [ ] Task 2.3: Location Services Integration
- [ ] Task 2.4: Nearby Families Discovery
- [ ] Task 2.5: Family Detail View

### Phase 3: Social Features - Connections & Messaging
- [ ] Task 3.1: Connection System
- [ ] Task 3.2: Messaging System
- [ ] Task 3.3: Push Notifications

### Phase 4: Safety & Polish
- [ ] Task 4.1: Safety Features
- [ ] Task 4.2: Profile & Settings Screen
- [ ] Task 4.3: UI/UX Polish
- [ ] Task 4.4: Performance Optimization
- [ ] Task 4.5: Testing & Bug Fixes

### Phase 5: Launch Preparation
- [ ] Task 5.1: App Store Assets
- [ ] Task 5.2: TestFlight Beta
- [ ] Task 5.3: Final Production Build

---

## Current Status / Progress Tracking

**Current Phase:** Phase 1: Foundation & Setup
**Current Task:** Task 1.1: Project Initialization (✅ Complete) → Task 1.2: Supabase Configuration (Next)
**Last Updated:** 2024-12-19
**GitHub Repo:** ✅ Connected to https://github.com/jakehb1/FAMLY.git

---

## Executor's Feedback or Assistance Requests

### Completed (2024-12-19)
**✅ npm unblocked:** Fixed by setting local cache directory: `npm config set cache ./node_modules/.cache`
**✅ Dependencies installed:** All 998 packages installed successfully
**✅ GitHub Repository:** Successfully connected to https://github.com/jakehb1/FAMLY.git
**✅ Project structure:** Expo Router setup with auth, tabs, and onboarding routes
**✅ Core files created:**
  - Zustand stores (auth, family, location)
  - Custom hooks (useAuth, useLocation)
  - UI components (Button, Input)
  - Supabase client configuration
  - Auth utilities
  - Location utilities

---

## Lessons

### Technical Decisions
- Using Expo for faster iteration and cross-platform foundation
- Supabase for backend (auth, database, real-time, storage) - reduces infrastructure complexity
- Zustand for state management - lightweight and simple
- NativeWind for styling - familiar Tailwind syntax
- PostGIS for efficient geospatial queries

### Known Constraints
- iOS-only for v1.0
- No media in messages for v1.0
- Events feature deferred to v1.1
- ID verification deferred to future version

### Setup Issues Encountered & Solutions
- **npm cache permissions:** Fixed by setting local cache: `npm config set cache ./node_modules/.cache` (avoids needing sudo)
- **Git initialization:** Make sure to initialize git in the project directory, not parent directory

### Known Constraints
- iOS-only for v1.0
- No media in messages for v1.0
- Events feature deferred to v1.1
- ID verification deferred to future version

---

## Success Metrics (Post-Launch)

- DAU/MAU ratio > 30%
- Avg connections per family > 5
- Message response rate > 60%
- 7-day retention > 40%
- App Store rating > 4.5

---

## Notes

- All location data must respect privacy radius
- Real-time features critical for messaging experience
- Trust & safety features are non-negotiable
- Performance optimization essential for location-based queries
- TestFlight beta crucial for gathering real-world feedback

