import { render, screen } from '@testing-library/react'
import { Skeleton } from '../skeleton'

describe('Skeleton', () => {
  it('renders correctly with default props', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton.tagName).toBe('DIV')
  })

  it('applies custom className', () => {
    const customClass = 'custom-skeleton-class'
    render(<Skeleton className={customClass} data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass(customClass)
  })

  it('forwards all props correctly', () => {
    const testProps = {
      onClick: jest.fn(),
      'data-testid': 'test-skeleton',
      role: 'button',
      style: { width: '100px', height: '20px' }
    }
    
    render(<Skeleton {...testProps} />)
    const skeleton = screen.getByTestId('test-skeleton')
    
    expect(skeleton).toHaveAttribute('role', 'button')
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' })
  })

  it('has correct default classes', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
  })

  it('renders with children content', () => {
    const content = 'Loading...'
    render(<Skeleton data-testid="skeleton">{content}</Skeleton>)
    
    expect(screen.getByTestId('skeleton')).toHaveTextContent(content)
  })

  it('handles empty children', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveTextContent('')
  })

  it('applies custom dimensions via className', () => {
    const customClass = 'w-32 h-8'
    render(<Skeleton className={customClass} data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('w-32', 'h-8')
  })

  it('combines default and custom classes', () => {
    const customClass = 'w-full h-4'
    render(<Skeleton className={customClass} data-testid="skeleton" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted', 'w-full', 'h-4')
  })
})
