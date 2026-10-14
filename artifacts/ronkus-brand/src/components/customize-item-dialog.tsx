import { useEffect, useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { customizationSettings, type Product } from '@/data/catalog';
import { formatNaira, type CustomizationDetails } from '@/lib/shop';

type CustomizeItemDialogProps = {
  product: Product | null;
  selectedColor?: string;
  onClose: () => void;
  onAddToCart: (customization: CustomizationDetails) => void;
};

export function CustomizeItemDialog({
  product,
  selectedColor,
  onClose,
  onAddToCart,
}: CustomizeItemDialogProps) {
  const [customizationType, setCustomizationType] = useState<string>(customizationSettings.types[0]);
  const [instructions, setInstructions] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!product) return;
    setCustomizationType(customizationSettings.types[0]);
    setInstructions('');
    setValidationMessage('');
  }, [product?.id, selectedColor]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInstructions = instructions.trim();
    if (trimmedInstructions.length < 10) {
      setValidationMessage('Please add a little more detail (at least 10 characters) so we can understand your request.');
      return;
    }
    if (!product?.customization?.enabled || !selectedColor) return;

    onAddToCart({
      type: customizationType,
      instructions: trimmedInstructions,
      fee: customizationSettings.fee,
    });
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="commerce-dialog customize-dialog">
        {product && (
          <>
            <DialogHeader className="commerce-dialog-heading">
              <p className="eyebrow">Make it yours</p>
              <DialogTitle>Customize Your Item</DialogTitle>
              <DialogDescription>
                Tell us what you have in mind for your apron.
              </DialogDescription>
            </DialogHeader>
            <div className="customize-product-summary">
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                <span>Selected colour: {selectedColor}</span>
              </div>
            </div>
            <form className="customize-form" onSubmit={handleSubmit}>
              <label className="commerce-field">
                <span>Customization type</span>
                <select
                  value={customizationType}
                  onChange={(event) => setCustomizationType(event.target.value)}
                  required
                >
                  {customizationSettings.types.map((type) => (
                    <option value={type} key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="commerce-field">
                <span>Describe your customization</span>
                <textarea
                  value={instructions}
                  onChange={(event) => {
                    setInstructions(event.target.value);
                    setValidationMessage('');
                  }}
                  placeholder="For example: Add the name “Amara” in gold lettering on the front pocket."
                  rows={4}
                  required
                  minLength={10}
                  aria-describedby={validationMessage ? 'customization-error' : 'customization-help'}
                />
                {validationMessage ? (
                  <span className="field-error" id="customization-error" role="alert">{validationMessage}</span>
                ) : (
                  <span className="field-help" id="customization-help">Include wording, placement, colours or other details that matter to you.</span>
                )}
              </label>
              <div className="customization-price-breakdown" aria-live="polite">
                <div><span>Apron</span><strong>{formatNaira(product.price)}</strong></div>
                <div><span>Customization fee</span><strong>{formatNaira(customizationSettings.fee)}</strong></div>
                <div className="price-breakdown-total"><span>Total for one</span><strong>{formatNaira(product.price + customizationSettings.fee)}</strong></div>
              </div>
              <button className="commerce-primary-button" type="submit">
                Add to Cart
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
