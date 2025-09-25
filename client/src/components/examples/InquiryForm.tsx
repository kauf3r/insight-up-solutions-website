import InquiryForm from '../InquiryForm';

export default function InquiryFormExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <InquiryForm 
        type="quote" 
        onSubmit={(data) => console.log('Form submitted:', data)}
      />
    </div>
  );
}