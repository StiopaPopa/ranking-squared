import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

export const ConfirmationModal = ({ isOpen, setIsOpen, pointsChange }) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">
            Ranking^2 submitted successfully 🥳
          </h2>
          <p>
            Your ranking^2 has been submitted and has contributed to updating
            the official rankings:
          </p>
          <div className="my-4">
            {Object.entries(pointsChange).map(
              ([rankingName, { before, after }]) => (
                <p key={rankingName}>
                  <span className="font-bold">{rankingName}:</span> {before} ➔{" "}
                  {after} points
                </p>
              )
            )}
          </div>
          <p>
            Oh, and you can go vote again, as many times as you want. This
            ranking didn't mean anything before, neither does it now!
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 bg-violet-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};
