# UI Components

This folder contains reusable UI components that provide consistent styling and behavior across the application.

## Components

### Button
A customizable button component with multiple variants and sizes.

**Props:**
- `title: string` - Button text
- `variant?: "primary" | "secondary" | "danger"` - Button style variant (default: "primary")
- `size?: "small" | "medium" | "large"` - Button size (default: "medium")
- `onPress?: () => void` - Press handler
- `style?: ViewStyle` - Additional styles

**Usage:**
```tsx
<Button title="Save" onPress={handleSave} />
<Button title="Cancel" variant="secondary" onPress={handleCancel} />
<Button title="Delete" variant="danger" size="small" onPress={handleDelete} />
```

### Chip
A selectable chip component for categories, tags, or filters.

**Props:**
- `label: string` - Chip text
- `selected?: boolean` - Whether the chip is selected (default: false)
- `variant?: "default" | "urgency"` - Chip style variant (default: "default")
- `onPress?: () => void` - Press handler
- `style?: ViewStyle` - Additional styles

**Usage:**
```tsx
<Chip label="Health" selected={selected} onPress={toggle} />
<Chip label="High" variant="urgency" selected={urgency === "high"} />
```

### EmptyState
A component to display when there's no content to show.

**Props:**
- `icon: keyof typeof Ionicons.glyphMap` - Ionicon name
- `title: string` - Main message
- `subtitle: string` - Secondary message
- `iconSize?: number` - Icon size (default: 48)
- `iconColor?: string` - Icon color (default: "#666")

**Usage:**
```tsx
<EmptyState
  icon="clipboard-outline"
  title="No tasks yet"
  subtitle="Tap the + button to add your first task"
/>
```

### Input
A styled text input component with label and error support.

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message to display
- `style?: TextStyle` - Additional styles
- All standard TextInput props

**Usage:**
```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

### LoadingState
A loading indicator with optional text.

**Props:**
- `text?: string` - Loading message (default: "Loading...")
- `size?: "small" | "large"` - Spinner size (default: "large")
- `color?: string` - Spinner color (default: "#fff")
- `centered?: boolean` - Whether to center in container (default: true)

**Usage:**
```tsx
<LoadingState text="Loading profile..." />
<LoadingState size="small" centered={false} />
```

### Modal
A customizable modal component with header and close button.

**Props:**
- `title: string` - Modal title
- `onClose: () => void` - Close handler
- `children: React.ReactNode` - Modal content
- `visible: boolean` - Whether modal is visible
- All standard Modal props

**Usage:**
```tsx
<Modal
  title="Add Task"
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
>
  <Input placeholder="Task title" />
  <Button title="Save" onPress={handleSave} />
</Modal>
```

### StatCard
A card component for displaying statistics.

**Props:**
- `title: string` - Stat label
- `value: string | number` - Stat value
- `subtitle?: string` - Optional subtitle
- `style?: ViewStyle` - Additional styles
- All standard View props

**Usage:**
```tsx
<StatCard title="Points" value={1250} />
<StatCard title="Tasks Completed" value={42} subtitle="This month" />
```

### TaskItem
A list item component for displaying tasks with icon and details.

**Props:**
- `title: string` - Task title
- `subtitle: string` - Task subtitle/description
- `icon: keyof typeof Ionicons.glyphMap` - Ionicon name
- `iconBackgroundColor?: string` - Icon background color (default: "#3E4246")
- `completed?: boolean` - Whether task is completed (default: false)
- All standard TouchableOpacity props

**Usage:**
```tsx
<TaskItem
  title="Complete workout"
  subtitle="50 points"
  icon="fitness-outline"
  onPress={() => completeTask(task.id)}
/>
```

## Design System

All components follow the app's dark theme design system:

- **Primary Color:** `#fff` (white)
- **Background:** `#25292e` (dark gray)
- **Secondary Background:** `#353a40` (lighter gray)
- **Text Primary:** `#fff` (white)
- **Text Secondary:** `#99A1C2` (light gray)
- **Border:** `#454b52` (gray)
- **Error:** `#ff6b6b` (red)

## Usage Guidelines

1. **Consistency:** Always use these components instead of creating custom implementations
2. **Theming:** Components automatically follow the dark theme
3. **Accessibility:** All components include proper accessibility support
4. **Performance:** Components are optimized and memoized where appropriate
5. **Extensibility:** Use the `style` prop to add custom styling when needed

## Import

Import components from the UI barrel export:

```tsx
import { Button, Input, Modal } from "../ui";
```

Or import individual components:

```tsx
import Button from "../ui/Button";
import Input from "../ui/Input";
```