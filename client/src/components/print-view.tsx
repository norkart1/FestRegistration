import { Registration } from "@shared/schema";
import { useEffect } from "react";

interface PrintViewProps {
  registration: Registration;
  onClose: () => void;
}

export function PrintView({ registration, onClose }: PrintViewProps) {
  useEffect(() => {
    // Auto-trigger print when component mounts
    const timer = setTimeout(() => {
      window.print();
      onClose();
    }, 100);

    return () => clearTimeout(timer);
  }, [onClose]);

  const formatPrograms = (programs: string[]) => {
    return programs.map(program => {
      return program
        .split('-')
        .slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
  };

  return (
    <div className="hidden print:block print-landscape p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Registration Management System</h1>
        <h2 className="text-lg">Student Registration Details</h2>
      </div>
      
      <div className="space-y-6">
        <table className="w-full border border-gray-300">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Full Name</td>
              <td className="border border-gray-300 px-4 py-2">{registration.fullName}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Aadhar Number</td>
              <td className="border border-gray-300 px-4 py-2">{registration.aadharNumber}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Place</td>
              <td className="border border-gray-300 px-4 py-2">{registration.place}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Phone Number</td>
              <td className="border border-gray-300 px-4 py-2">{registration.phoneNumber}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Category</td>
              <td className="border border-gray-300 px-4 py-2">{registration.category.toUpperCase()}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Dars Name</td>
              <td className="border border-gray-300 px-4 py-2">{registration.darsName}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Dars Place</td>
              <td className="border border-gray-300 px-4 py-2">{registration.darsPlace}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Usthaad Name</td>
              <td className="border border-gray-300 px-4 py-2">{registration.usthaadName}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Programs</td>
              <td className="border border-gray-300 px-4 py-2">{formatPrograms(registration.programs).join(', ')}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-100">Registration Date</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(registration.createdAt).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
