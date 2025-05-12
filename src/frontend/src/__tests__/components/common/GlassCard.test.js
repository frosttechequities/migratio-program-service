import React from 'react';
import { render, screen } from '@testing-library/react';
import GlassCard from '../../../components/common/GlassCard';

describe('GlassCard Component', () => {
  test('renders children correctly', () => {
    render(
      <GlassCard>
        <div>Test Content</div>
      </GlassCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('applies default glassmorphism styles', () => {
    render(
      <GlassCard data-testid="glass-card">
        <div>Test Content</div>
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    
    // Check default styles
    expect(card).toHaveStyle('background: rgba(255, 255, 255, 0.7)');
    expect(card).toHaveStyle('backdrop-filter: blur(10px)');
    expect(card).toHaveStyle('border: 1px solid rgba(255, 255, 255, 0.2)');
  });
  
  test('applies custom blur and opacity', () => {
    render(
      <GlassCard 
        blur={20} 
        opacity={0.5}
        data-testid="glass-card"
      >
        <div>Test Content</div>
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    
    // Check custom styles
    expect(card).toHaveStyle('background: rgba(255, 255, 255, 0.5)');
    expect(card).toHaveStyle('backdrop-filter: blur(20px)');
  });
  
  test('applies custom border color', () => {
    render(
      <GlassCard 
        borderColor="rgba(0, 0, 0, 0.1)"
        data-testid="glass-card"
      >
        <div>Test Content</div>
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    
    // Check custom border color
    expect(card).toHaveStyle('border: 1px solid rgba(0, 0, 0, 0.1)');
  });
  
  test('applies custom elevation', () => {
    render(
      <GlassCard 
        elevation={3}
        data-testid="glass-card"
      >
        <div>Test Content</div>
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    
    // Paper component should have elevation prop set
    expect(card).toHaveAttribute('elevation', '3');
  });
  
  test('applies additional styles via sx prop', () => {
    render(
      <GlassCard 
        sx={{ padding: '24px', maxWidth: '400px' }}
        data-testid="glass-card"
      >
        <div>Test Content</div>
      </GlassCard>
    );
    
    const card = screen.getByTestId('glass-card');
    
    // Check additional styles
    expect(card).toHaveStyle('padding: 24px');
    expect(card).toHaveStyle('max-width: 400px');
  });
});
