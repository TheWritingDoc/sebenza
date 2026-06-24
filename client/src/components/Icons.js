import React from 'react';
import {
  // Navigation & Actions
  Home, MapPin, Briefcase, User, UserCircle, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ArrowLeft, ArrowRight, Navigation, Compass,
  // Communication
  MessageCircle, Mail, Phone, Send, Megaphone, Bell, Share2,
  // Status & Feedback
  CheckCircle2, XCircle, AlertCircle, Info, HelpCircle, Star, Heart, ThumbsUp,
  // Content
  Camera, Image, ImagePlus, Video, FileText, ClipboardList, FolderOpen, Bookmark,
  BookOpen, Newspaper,
  // Work & Tools
  Hammer, Wrench, Droplets, Zap, Paintbrush, PaintBucket, Scissors, Ruler,
  Monitor, Laptop, Smartphone, Cpu, Wifi,
  // Lifestyle
  Car, Truck, UtensilsCrossed, Coffee, Wine, ShoppingBag, ShoppingCart, Gift,
  Flower2, TreePine, Sun, Cloud, CloudRain, Thermometer,
  // Security & Money
  Lock, Unlock, Shield, ShieldCheck, Eye, EyeOff, Key, Wallet, Banknote, CreditCard,
  Receipt, Coins,
  // Time & Misc
  Clock, Calendar, Timer, Hourglass, History, RotateCcw, RefreshCw, Loader2,
  Sparkles, Search, Filter, SlidersHorizontal, MoreHorizontal, MoreVertical,
  Plus, PlusCircle, Minus, MinusCircle, Trash2, Edit3, Copy, Download, Upload,
  // Social
  Users, UserPlus, UserMinus, UserCheck, Handshake, HeartHandshake, Award, Trophy, Crown,
  // Animals (use emoji fallback for paw)
  Bone, Bird, Fish,
  // Arrows & indicators
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart,
  // Misc playful
  Rocket, PartyPopper, Flame, Lightbulb, Pin, Map, Hand,
} from 'lucide-react';

// ============================================================
// PROFESSIONAL ICON SYSTEM
// ============================================================
// All icons use consistent styling:
// - Clean strokes with confident weight
// - Rounded corners on icon containers
// - Soft gradients for backgrounds
// - Subtle shadows and hover lifts
// ============================================================

export const ICON_SIZE = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 44,
  '3xl': 56,
};

export const ICON_STROKE = {
  thin: 1.5,
  normal: 2,
  thick: 2.5,
};

// ----- Icon Container Component -----
// Renders any Lucide icon inside a polished, professional container
export function IconBox({
  icon: Icon,
  size = 'md',
  stroke = 'normal',
  color = '#6366f1',
  bg = 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  borderRadius = 14,
  padding = 10,
  className = '',
  style = {},
  ring = false,
  ringColor = 'rgba(255,255,255,0.4)',
  ...props
}) {
  const s = typeof size === 'string' ? ICON_SIZE[size] : size;
  const sw = typeof stroke === 'string' ? ICON_STROKE[stroke] : stroke;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s + padding * 2,
        height: s + padding * 2,
        borderRadius,
        background: bg,
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)',
        border: ring ? `2px solid ${ringColor}` : 'none',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}
      {...props}
    >
      {Icon && <Icon size={s} strokeWidth={sw} color={color} />}
    </div>
  );
}

// ----- Feature Icon (Homepage Hero) -----
// Larger, more impactful icon for feature sections
export function FeatureIcon({
  icon: Icon,
  size = '2xl',
  stroke = 'thick',
  color = '#6366f1',
  bg = 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  borderRadius = 20,
  padding = 18,
  className = '',
  style = {},
  ...props
}) {
  const s = typeof size === 'string' ? ICON_SIZE[size] : size;
  const sw = typeof stroke === 'string' ? ICON_STROKE[stroke] : stroke;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s + padding * 2,
        height: s + padding * 2,
        borderRadius,
        background: bg,
        flexShrink: 0,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), inset 0 1px 1px rgba(255,255,255,0.35), 0 0 0 1px rgba(0,0,0,0.03)',
        border: '1px solid rgba(255,255,255,0.4)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        cursor: 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
        e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.14), inset 0 1px 1px rgba(255,255,255,0.4), 0 0 0 1px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10), inset 0 1px 1px rgba(255,255,255,0.35), 0 0 0 1px rgba(0,0,0,0.03)';
      }}
      {...props}
    >
      {Icon && <Icon size={s} strokeWidth={sw} color={color} />}
    </div>
  );
}

// ----- Quick Action Button Icon -----
// Used for dashboard action cards
export function ActionIcon({ icon: Icon, color, size = 'lg' }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 16,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      <Icon size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.thick} color="white" />
    </div>
  );
}

// ----- Category Icon Mapping -----
export const CATEGORY_ICONS = {
  Plumbing: { icon: Droplets, color: '#3b82f6', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  Electrical: { icon: Zap, color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  Carpentry: { icon: Hammer, color: '#8b5cf6', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
  Painting: { icon: Paintbrush, color: '#ec4899', bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  Cleaning: { icon: Sparkles, color: '#06b6d4', bg: 'linear-gradient(135deg, #cffafe, #a5f3fc)' },
  Gardening: { icon: Flower2, color: '#22c55e', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  Cooking: { icon: UtensilsCrossed, color: '#f97316', bg: 'linear-gradient(135deg, #ffedd5, #fed7aa)' },
  Tutoring: { icon: BookOpen, color: '#6366f1', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)' },
  'Computer Repair': { icon: Monitor, color: '#64748b', bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' },
  Sewing: { icon: Scissors, color: '#d946ef', bg: 'linear-gradient(135deg, #fdf4ff, #f5d0fe)' },
  Driving: { icon: Car, color: '#3b82f6', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  Babysitting: { icon: Heart, color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  'Elderly Care': { icon: HeartHandshake, color: '#8b5cf6', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
  'Pet Care': { icon: Bone, color: '#f97316', bg: 'linear-gradient(135deg, #ffedd5, #fed7aa)' },
  Technology: { icon: Cpu, color: '#8b5cf6', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
  Other: { icon: Sparkles, color: '#64748b', bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' },
};

// ----- Homepage Feature Icons -----
// Pre-configured professional icon sets for landing page sections
export const HOME_FEATURE_ICONS = {
  signUp: { icon: UserPlus, color: '#4f46e5', bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  search: { icon: Search, color: '#0891b2', bg: 'linear-gradient(135deg, #cffafe, #a5f3fc)' },
  connect: { icon: Handshake, color: '#7c3aed', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
  rate: { icon: Star, color: '#d97706', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  users: { icon: Users, color: '#4f46e5', bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  services: { icon: Briefcase, color: '#059669', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
  jobs: { icon: CheckCircle2, color: '#ea580c', bg: 'linear-gradient(135deg, #ffedd5, #fed7aa)' },
  app: { icon: Smartphone, color: '#4f46e5', bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  android: { icon: Smartphone, color: '#16a34a', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  ios: { icon: Smartphone, color: '#2563eb', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
};

// Render a category icon box
export function CategoryIcon({ category, size = 'md' }) {
  const config = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
  const s = typeof size === 'string' ? ICON_SIZE[size] : size;
  return (
    <IconBox
      icon={config.icon}
      size={s}
      color={config.color}
      bg={config.bg}
      borderRadius={size === 'xl' ? 18 : size === 'lg' ? 16 : 12}
      padding={size === 'xl' ? 14 : size === 'lg' ? 12 : 8}
    />
  );
}

// ----- Dashboard Quick Action Icons -----
export const DASHBOARD_ACTIONS = [
  { icon: Briefcase, label: 'Job Board', sub: 'Find & post gigs', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { icon: Megaphone, label: 'Offer Service', sub: 'Post your skills', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { icon: MapPin, label: 'Browse Map', sub: 'See nearby help', color: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { icon: Bookmark, label: 'Business Cards', sub: 'Saved services', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { icon: ClipboardList, label: 'My Work', sub: 'Track your deals', color: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { icon: UserCircle, label: 'My Profile', sub: 'Skills & history', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
];

// ----- Status & Common Icons -----
export const StatusIcons = {
  success: ({ size = 'sm' } = {}) => <CheckCircle2 size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.normal} color="#22c55e" />,
  error: ({ size = 'sm' } = {}) => <XCircle size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.normal} color="#ef4444" />,
  warning: ({ size = 'sm' } = {}) => <AlertCircle size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.normal} color="#f59e0b" />,
  info: ({ size = 'sm' } = {}) => <Info size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.normal} color="#3b82f6" />,
  loading: ({ size = 'sm' } = {}) => <Loader2 size={ICON_SIZE[size]} strokeWidth={ICON_STROKE.normal} color="#6366f1" className="animate-spin" />,
  star: ({ size = 'sm', filled = true } = {}) => (
    <Star
      size={ICON_SIZE[size]}
      strokeWidth={ICON_STROKE.normal}
      color={filled ? '#f59e0b' : '#cbd5e1'}
      fill={filled ? '#f59e0b' : 'none'}
    />
  ),
};

// ----- Re-export all Lucide icons for convenience -----
export {
  Home, MapPin, Briefcase, User, UserCircle, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ArrowLeft, ArrowRight, Navigation, Compass,
  MessageCircle, Mail, Phone, Send, Megaphone, Bell, Share2,
  CheckCircle2, XCircle, AlertCircle, Info, HelpCircle, Star, Heart, ThumbsUp,
  Camera, Image, ImagePlus, Video, FileText, ClipboardList, FolderOpen, Bookmark,
  BookOpen, Newspaper,
  Hammer, Wrench, Droplets, Zap, Paintbrush, PaintBucket, Scissors, Ruler,
  Monitor, Laptop, Smartphone, Cpu, Wifi,
  Car, Truck, UtensilsCrossed, Coffee, Wine, ShoppingBag, ShoppingCart, Gift,
  Flower2, TreePine, Sun, Cloud, CloudRain, Thermometer,
  Lock, Unlock, Shield, ShieldCheck, Eye, EyeOff, Key, Wallet, Banknote, CreditCard,
  Receipt, Coins,
  Clock, Calendar, Timer, Hourglass, History, RotateCcw, RefreshCw, Loader2,
  Sparkles, Search, Filter, SlidersHorizontal, MoreHorizontal, MoreVertical,
  Plus, PlusCircle, Minus, MinusCircle, Trash2, Edit3, Copy, Download, Upload,
  Users, UserPlus, UserMinus, UserCheck, Handshake, HeartHandshake, Award, Trophy, Crown,
  Bone, Bird, Fish,
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart,
  Rocket, PartyPopper, Flame, Lightbulb, Pin, Map, Hand,
};
