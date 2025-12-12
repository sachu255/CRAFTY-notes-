
import React from 'react';
import { NoteColor } from './services/types';

export const COLORS = [
  { label: 'White', value: NoteColor.White, hex: '#ffffff' },
  { label: 'Red', value: NoteColor.Red, hex: '#fee2e2' },
  { label: 'Orange', value: NoteColor.Orange, hex: '#ffedd5' },
  { label: 'Yellow', value: NoteColor.Yellow, hex: '#fef9c3' },
  { label: 'Green', value: NoteColor.Green, hex: '#dcfce7' },
  { label: 'Teal', value: NoteColor.Teal, hex: '#ccfbf1' },
  { label: 'Blue', value: NoteColor.Blue, hex: '#dbeafe' },
  { label: 'Purple', value: NoteColor.Purple, hex: '#f3e8ff' },
  { label: 'Pink', value: NoteColor.Pink, hex: '#fce7f3' },
  { label: 'Gray', value: NoteColor.Gray, hex: '#e5e7eb' },
];

export const SupermanCapeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.64 3.22C11.64 3.22 8.44 6.13 6.94 9.69C6.44 10.89 5.86 13.39 6.25 15.69C6.64 17.99 8.24 19.88 10.34 19.88C11.54 19.88 12.64 19.29 13.34 18.29C13.34 18.29 15.64 15.89 16.64 12.99C17.64 10.09 17.64 5.99 17.64 5.99L14.64 2.99L11.64 3.22Z" fill="#EF4444" />
    <path d="M14.64 2.99L17.64 5.99C17.64 5.99 20.64 11.99 19.64 16.99L13.34 18.29C13.34 18.29 15.64 15.89 16.64 12.99C17.64 10.09 17.64 5.99 17.64 5.99" fill="#B91C1C" opacity="0.3" />
    <path d="M6.94 9.69C6.94 9.69 4.94 10.69 3.94 13.69C2.94 16.69 4.44 19.69 5.94 20.69L10.34 19.88C8.24 19.88 6.64 17.99 6.25 15.69C5.86 13.39 6.44 10.89 6.94 9.69Z" fill="#991B1B" opacity="0.3" />
  </svg>
);

export const SantaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.65 3.32 1.71 4.54L6 14v6h12v-6l-.71-.46C18.35 12.32 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z" fill="#EF4444" opacity="0.2"/>
    <path d="M12 2C9.24 2 7 4.24 7 7h10c0-2.76-2.24-5-5-5z" fill="#EF4444"/>
    <circle cx="12" cy="2" r="1.5" fill="white"/>
    <path d="M7 14h10v2H7z" fill="white"/>
    <path d="M4 10h2v2H4zM18 10h2v2h-2z" fill="#EF4444"/>
  </svg>
);

export const ShieldIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#3B82F6"/>
    <path d="M12 3.3L19 6.3V11c0 4.1-2.5 8.03-7 9.5-4.5-1.47-7-5.4-7-9.5V6.3l7-3z" fill="#2563EB" opacity="0.5"/>
  </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#EAB308"/>
  </svg>
);

export const RocketIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.5 7.5a4.5 4.5 0 019 0c0 1.3-.5 2.5-1.4 3.4l.7 2.2a.8.8 0 01-1.4.8l-1.5-1.6-1.9.5-1.9-.5-1.5 1.6a.8.8 0 01-1.4-.8l.7-2.2A4.5 4.5 0 017.5 7.5zM12 4.5a3 3 0 00-3 3c0 .8.3 1.6.9 2.1l2.1-2.2 2.1 2.2c.6-.5.9-1.3.9-2.1a3 3 0 00-3-3z" fill="#EF4444"/>
    <path d="M12 12l1 3 4 4-2 2-4-4-4 4-2-2 4-4 1-3 2-2z" fill="#991B1B" opacity="0.6"/>
  </svg>
);

export const BoltIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#EAB308"/>
  </svg>
);

export const CrownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" fill="#F59E0B"/>
  </svg>
);

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];
