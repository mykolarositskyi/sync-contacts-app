import { render, screen } from '@testing-library/react'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders correctly with default props', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('forwards all props correctly', () => {
    const testProps = {
      placeholder: 'Enter description',
      rows: 5,
      disabled: true,
      'data-testid': 'description-textarea'
    }
    
    render(<Textarea {...testProps} />)
    const textarea = screen.getByTestId('description-textarea')
    
    expect(textarea).toHaveAttribute('placeholder', 'Enter description')
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toBeDisabled()
  })

  it('applies custom className', () => {
    const customClass = 'custom-textarea-class'
    render(<Textarea className={customClass} data-testid="textarea" />)
    
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveClass(customClass)
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Textarea ref={ref} data-testid="textarea" />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('has correct default classes', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    
    expect(textarea).toHaveClass('flex', 'min-h-[60px]', 'w-full', 'rounded-md', 'border')
  })

  it('handles value and onChange', () => {
    const handleChange = jest.fn()
    render(
      <Textarea 
        value="test content" 
        onChange={handleChange} 
        data-testid="textarea" 
      />
    )
    
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveValue('test content')
  })

  it('renders with placeholder text', () => {
    const placeholder = 'Please enter your message here'
    render(<Textarea placeholder={placeholder} data-testid="textarea" />)
    
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('placeholder', placeholder)
  })

  it('handles disabled state', () => {
    render(<Textarea disabled data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles rows attribute', () => {
    render(<Textarea rows={10} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    
    expect(textarea).toHaveAttribute('rows', '10')
  })

  it('handles maxLength attribute', () => {
    render(<Textarea maxLength={500} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    
    expect(textarea).toHaveAttribute('maxLength', '500')
  })
})
