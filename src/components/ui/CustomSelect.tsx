import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { createPortal } from "react-dom";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true); // true to capture all scrolls

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`form-input flex items-center justify-between text-left cursor-pointer ${isOpen ? "ring-2 ring-neutral-800/50 border-neutral-800/50" : ""
          }`}
      >
        <span className={selectedOption ? "text-neutral-200" : "text-neutral-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoChevronDown className="text-neutral-400" />
        </motion.div>
      </button>

      {/* Portal for Dropdown */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Invisible Backdrop to handle 'click outside' */}
              <div
                className="fixed inset-0 z-[9998] cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  top: position.top + 8, // Add a little gap
                  left: position.left,
                  width: position.width,
                }}
                className="absolute z-[9999] bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl"
              >
                <div className="max-h-56 overflow-y-auto ">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing immediately via backdrop (though it's behind)
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-1.5 text-sm text-left transition-colors ${value === option.value
                        ? "bg-neutral-800 text-neutral-300"
                        : "text-neutral-400 hover:bg-white/10 hover:text-neutral-300"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
