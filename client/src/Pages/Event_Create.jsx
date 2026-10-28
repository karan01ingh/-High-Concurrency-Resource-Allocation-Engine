import { useEffect, useState } from "react";
import { useToast } from "../Context/ToastContext";

const initialEvent = {
  title: "",
  description:
    "",
  startDate: "2026-12-25",
  startTime: "16:00",
  endDate: "2026-02-17",
  endTime: "23:00",
  timezone: "Asia/Kolkata",
  allDay: false,
  venue: "",
  address: "",
};

const initialImages = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80",
];


const steps = [
  "Event Details",
  "Ticket & Pricing",
  "Review & Publish",
];

function Icon({ children, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      {children}
    </span>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function formatDate(value) {
  if (!value) return "Select date";

  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Select time";

  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export default function CreateEvent() {
  const [idempotency_Key, setIdempotencyKey] = useState(
    () => crypto.randomUUID()
  );
  const toast = useToast();
  const [event, setEvent] = useState(initialEvent);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [ticketTypes, setTicketTypes] = useState([
    { name: "Early Bird", quantity: "200", price: "999" }
  ]);
  const [additionalInfo, setAdditionalInfo] = useState({
    tags: "Music, Food & Drinks, Art, Networking",
    terms: "",
  });

  const [savedObjectUrls, setSavedObjectUrls] = useState([]);

  useEffect(() => {
    return () => {
      savedObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [savedObjectUrls]);

  const updateEvent = (key, value) => {
    setEvent((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setMessage("Only JPG, PNG or WEBP images up to 5 MB are allowed.");
    }

    const availableSlots = Math.max(0, 4 - images.length);
    const selected = validFiles.slice(0, availableSlots);
    const urls = selected.map((file) => URL.createObjectURL(file));

    setImages((current) => [
      ...current,
      ...selected.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        url: urls[index],
      })),
    ]);
    setSavedObjectUrls((current) => [...current, ...urls]);

    e.target.value = "";
  }

  function removeImage(id) {
    setImages((current) => current.filter((image) => image.id !== id));
  }

  function validateStep() {
    if (step === 0) {
      if (!event.title.trim() || !event.description.trim()) {
        toast.warning("Please complete all required event details.", {
          title: "Validation Error",
        });
        return false;
      }

      if (!event.startDate || !event.startTime ) {
        toast.warning("Please provide the event start and end date/time.",{title:"Validation Error"});
        return false;
      }

      const start = new Date(`${event.startDate}T${event.startTime}`);

      if (!event.venue.trim() || !event.address.trim()) {
        toast.warning("Please enter the venue name and address..",{title:"Validation Error"});
        return false;
      }
    }

    if (step === 1) {
      const invalidTicket = ticketTypes.some(
        (ticket) =>
          !ticket.name.trim() ||
          ticket.quantity === "" ||
          ticket.price === "" ||
          Number(ticket.quantity) <= 0 ||
          Number(ticket.price) < 0
      );

      if (invalidTicket) {
        toast.warning("Enter a valid name, quantity and price for every ticket type.",{title:"Validation Error"});
        return false;
      }
    }

    setMessage("");
    return true;
  }

  async function createEventAPI() {
  const payload = {
    event_date: event.startDate,
    event_time: event.startTime,
    event_name: event.title.trim(),
    event_capacity: Number(ticketTypes[0].quantity),
    event_ticket_price: Number(ticketTypes[0].price),
    event_place: event.venue.trim(),
    event_description: event.description.trim(),
    idempotency_key: idempotency_Key
  };

  console.log("payload",payload)
  const userId = "1219473";

  const response = await fetch(
    `http://127.0.0.1:8000/events/create-event/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.detail || "Event creation failed"
    );
  }

  return result;
}


async function goNext() {
  if (!validateStep()) {
    toast.warning(message || "Please complete all required fields.", {
      title: "Validation Error",
    });
    return;
  }

  if (step < steps.length - 1) {
    setStep((current) => current + 1);
    return;
  }

  try {
    const result = await createEventAPI();

    toast.success(
      result.message || "Event created successfully!",
      { title: "Success" }
    );
    setEvent(initialEvent);
  setImages([]);
  setTicketTypes([
    { name: "Early Bird", quantity: "200", price: "999" },
  ]);
  setAdditionalInfo({
    tags: "Music, Food & Drinks, Art, Networking",
    terms: "",
  });
  setStep(0);
  setMessage("");
  } catch (error) {
    console.error("Create event error:", error);

    toast.error(
      error.message || "Failed to create event.",
      { title: "Event Creation Failed" }
    );
  }
}


  function updateTicket(index, key, value) {
    setTicketTypes((current) =>
      current.map((ticket, i) =>
        i === index ? { ...ticket, [key]: value } : ticket
      )
    );
  }

  const coverImage = images[0]?.url || initialImages[0];
  const totalTickets = ticketTypes.reduce(
    (sum, ticket) => sum + (Number(ticket.quantity) || 0),
    0
  );

  const categoryEmoji = {
    Music: "♫",
    Tech: "⌘",
    "Food & Drinks": "♨",
    Art: "▧",
    Networking: "♧",
    Sports: "⚡",
    Comedy: "☻",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Organizer sidebar + page */}
      <div className="flex min-h-[calc(100vh-60px)]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-4 py-5 lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-950 text-xl text-white">
              ♬
            </div>
            <div>
              <p className="text-sm font-bold">Sunburn Live</p>
              <p className="mt-1 text-xs text-slate-500">Organizer Account</p>
              <button
                type="button"
                className="mt-1 text-xs font-semibold text-emerald-700 underline"
              >
                View Profile
              </button>
            </div>
          </div>

          <nav className="mt-7 space-y-2">
            {[
              ["▦", "Dashboard"],
              ["▤", "My Events"],
              ["⊕", "Create Event"],
              ["▣", "Event Bookings"],
              ["▥", "Analytics"],
              ["♧", "Wallet & Payouts"],
              ["♙", "Profile"],
            ].map(([icon, label]) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                  label === "Create Event"
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}

            <button
              type="button"
              className="mt-5 flex w-full items-center gap-4 px-4 py-3 text-sm font-medium text-red-500"
            >
              <span className="text-xl">⇥</span>
              Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 xl:px-7">
          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {steps[step]}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details to create and publish your event.
            </p>
          </div>

          {/* Four-step progress */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
            {steps.map((label, index) => (
              <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (index < step) {
                      setStep(index);
                      setMessage("");
                    }
                  }}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === step
                      ? "bg-emerald-700 text-white"
                      : index < step
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </button>
                <span
                  className={`whitespace-nowrap text-xs ${
                    index === step
                      ? "font-semibold text-emerald-800"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <span className="mx-1 h-px min-w-4 flex-1 bg-slate-200" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)]">
            {/* Form */}
            <section className="min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              {step === 0 && (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold">Basic Information</h2>
                    <p className="text-xs text-slate-500">
                      Provide the main details about your event.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field label="Event Title" required>
                      <div className="relative">
                        <input
                          className={`${inputClass} pr-16`}
                          maxLength={100}
                          value={event.title}
                          onChange={(e) => updateEvent("title", e.target.value)}
                          placeholder="Enter event title"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                          {event.title.length}/100
                        </span>
                      </div>
                    </Field>

                    <Field label="Short Description" required>
                      <div className="relative">
                        <textarea
                          className={`${inputClass} min-h-24 resize-y pr-14`}
                          maxLength={300}
                          value={event.description}
                          onChange={(e) =>
                            updateEvent("description", e.target.value)
                          }
                          placeholder="Describe your event..."
                        />
                        <span className="absolute bottom-3 right-3 text-[10px] text-slate-400">
                          {event.description.length}/300
                        </span>
                      </div>
                    </Field>
                  </div>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold">Event Media</h2>
                      <p className="text-xs text-slate-500">
                        Add images to showcase your event.
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      Recommended: 1920 × 1080 (16:9)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative h-28 overflow-hidden rounded-lg sm:h-28"
                      >
                        <img
                          src={image.url}
                          alt={`Event upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">
                            Cover Image
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          aria-label="Remove image"
                          className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/70 text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {images.length < 4 && (
                      <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-emerald-500 hover:bg-emerald-50">
                        <span className="text-2xl text-slate-500">⇧</span>
                        <span className="mt-1 text-xs font-medium">
                          Upload Images
                        </span>
                        <span className="mt-1 text-[10px] text-slate-500">
                          JPG, PNG, WEBP · Max 5 MB
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="mb-4">
                    <h2 className="text-lg font-bold">Date & Time</h2>
                    <p className="text-xs text-slate-500">
                      Set the event date, time, and duration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Field label="Start Date" required>
                      <input
                        type="date"
                        className={inputClass}
                        value={event.startDate}
                        onChange={(e) => updateEvent("startDate", e.target.value)}
                      />
                    </Field>
                    <Field label="Start Time" required>
                      <input
                        type="time"
                        className={inputClass}
                        disabled={event.allDay}
                        value={event.startTime}
                        onChange={(e) => updateEvent("startTime", e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-5">
                    <Field label="Timezone">
                      <select
                        className={`${inputClass} min-w-56`}
                        value={event.timezone}
                        onChange={(e) => updateEvent("timezone", e.target.value)}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </Field>

                    <label className="mt-5 flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={event.allDay}
                        onChange={(e) => updateEvent("allDay", e.target.checked)}
                        className="size-4 accent-emerald-700"
                      />
                      All day event
                    </label>
                  </div>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="mb-4">
                    <h2 className="text-lg font-bold">Location</h2>
                    <p className="text-xs text-slate-500">
                      Specify the event venue and location.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Venue Name" required>
                      <input
                        className={inputClass}
                        value={event.venue}
                        onChange={(e) => updateEvent("venue", e.target.value)}
                        placeholder="Venue name"
                      />
                    </Field>
                    <Field label="Address" required>
                      <input
                        className={inputClass}
                        value={event.address}
                        onChange={(e) => updateEvent("address", e.target.value)}
                        placeholder="City, region, country"
                      />
                    </Field>
                  </div>

                  <div className="mt-3 flex h-28 items-center justify-center rounded-lg border border-slate-200 bg-sky-50 text-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        <span className="text-red-500">●</span> {event.venue}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{event.address}</p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        Map preview placeholder · Connect a map provider to pin the venue
                      </p>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-lg font-bold">Ticket & Pricing</h2>
                  <p className="mb-5 text-xs text-slate-500">
                    Define ticket types, available quantities and prices.
                  </p>

                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1.3fr_1fr_1fr]"
                      >
                        <Field label="Quantity" required>
                          <input
                            type="number"
                            min="1"
                            className={inputClass}
                            value={ticket.quantity}
                            onChange={(e) =>
                              updateTicket(index, "quantity", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Price (₹)" required>
                          <input
                            type="number"
                            min="0"
                            className={inputClass}
                            value={ticket.price}
                            onChange={(e) =>
                              updateTicket(index, "price", e.target.value)
                            }
                          />
                        </Field>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    Total ticket inventory:{" "}
                    <strong>{totalTickets.toLocaleString("en-IN")}</strong>
                  </p>
                </>
              )}

              {/* {step === 2 && (
                <>
                  <h2 className="text-lg font-bold">Additional Information</h2>
                  <p className="mb-5 text-xs text-slate-500">
                    Add discoverability tags and terms for attendees.
                  </p>

                  <Field label="Event Tags">
                    <input
                      className={inputClass}
                      value={additionalInfo.tags}
                      onChange={(e) =>
                        setAdditionalInfo((current) => ({
                          ...current,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="Music, Outdoor, Festival"
                    />
                  </Field>

                  <div className="mt-4">
                    <Field label="Terms & Conditions">
                      <textarea
                        className={`${inputClass} min-h-36`}
                        value={additionalInfo.terms}
                        onChange={(e) =>
                          setAdditionalInfo((current) => ({
                            ...current,
                            terms: e.target.value,
                          }))
                        }
                        placeholder="Enter ticket and event terms..."
                      />
                    </Field>
                  </div>
                </>
              )} */}

              {step === 2 && (
                <>
                  <h2 className="text-lg font-bold">Review & Publish</h2>
                  <p className="mb-5 text-xs text-slate-500">
                    Review the event details before connecting the publish API.
                  </p>

                  <div className="space-y-3 text-sm">
                    {[
                      ["Event", event.title],
                      ["Start", `${formatDate(event.startDate)} · ${formatTime(event.startTime)}`],
                      ["Venue", event.venue],
                      ["Address", event.address],
                      ["Total Tickets", totalTickets.toLocaleString("en-IN")],
                      ["Ticket Price",ticketTypes.map((ticket) => ticket.price).join(", "),]
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-wrap justify-between gap-3 border-b border-slate-100 py-2"
                      >
                        <span className="text-slate-500">{label}</span>
                        <span className="text-right font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {message && (
                <div
                  role="status"
                  className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900"
                >
                  {message}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => {
                    setStep((current) => Math.max(0, current - 1));
                    setMessage("");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  {step === steps.length - 1
                    ? "Review Complete"
                    : step === 0
                      ? "Next: Ticket & Pricing →"
                      : `Next: ${steps[step + 1]} →`}
                </button>
              </div>
            </section>

            {/* Live Preview */}
            <aside className="min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 2xl:sticky 2xl:top-20">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Live Preview</h2>
                  <p className="text-xs text-slate-500">
                    See how your event will look to users.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="shrink-0 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  View Full Page →
                </button>
              </div>

              <div className="relative overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={coverImage}
                  alt={event.title || "Event cover"}
                  className="h-48 w-full object-cover sm:h-52"
                />
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  <button
                    type="button"
                    aria-label="Share event"
                    className="flex size-9 items-center justify-center rounded-lg bg-black/50 text-lg text-white"
                  >
                    ↗
                  </button>
                  <button
                    type="button"
                    aria-label="Favorite event"
                    className="flex size-9 items-center justify-center rounded-lg bg-black/50 text-xl text-white"
                  >
                    ♡
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold leading-tight">
                  {event.title || "Your Event Title"}
                </h3>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ● Live
                </span>
              </div>

              <div className="mt-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {event.category} {event.type}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Icon className="text-lg text-emerald-700">▦</Icon>
                  <div>
                    <p>{formatDate(event.startDate)} – {formatDate(event.endDate)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {event.allDay
                        ? "All day"
                        : `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon className="text-lg text-emerald-700">♧</Icon>
                  <p>{event.address || "Your event location"}</p>
                </div>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <h3 className="font-bold">About This Event</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {event.description || "Your event description will appear here."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {additionalInfo.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"
                    >
                      {categoryEmoji[tag] || "✦"} {tag}
                    </span>
                  ))}
              </div>

              <div className="mt-5 flex h-24 items-center justify-center rounded-lg border border-slate-100 bg-sky-50 text-center">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    📍 {event.venue || "Event venue"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.address || "Event address"}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Map integration can be added later
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-slate-900">
                  Complete all steps to publish your event
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Set ticket prices, add rules, and review your event details.
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {step === 0 ? "Next: Ticket & Pricing →" : "Continue →"}
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
