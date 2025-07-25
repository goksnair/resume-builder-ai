import React from 'react';

const ProfessionalTemplatesTest = () => {
    console.log('ProfessionalTemplatesTest component rendering');

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">Professional Templates</h1>
            <p className="text-gray-600">Test page is working!</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Test Template 1</h3>
                    <p className="text-gray-600">This is a test template</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Preview
                    </button>
                </div>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Test Template 2</h3>
                    <p className="text-gray-600">This is another test template</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Preview
                    </button>
                </div>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Test Template 3</h3>
                    <p className="text-gray-600">This is a third test template</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTemplatesTest;
