"use client";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DotsThreeCircle } from "phosphor-react";
// import { DesktopModal, MobileModal } from "./Modals";
import { createClient } from "@/utils/supabase/client";
import ShareModal from "./ShareModal";

export default function Header({
  username,
  dentistry_id,
  contact_email,
}: {
  username: string;
  dentistry_id: string;
  contact_email: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  // Handle the scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fetchProfilePicture = async (dentistryId: string) => {
    try {
      const supabase = createClient();

      // Check if the profile picture exists in the storage
      const { data, error } = await supabase.storage
        .from("profile-pics")
        .list(dentistryId);

      if (error) throw error;

      if (data.length > 0) {
        const fileName = data[0].name;
        const { data: urlData } = await supabase.storage
          .from("profile-pics")
          .getPublicUrl(`${dentistryId}/${fileName}`);

        setProfilePicUrl(urlData?.publicUrl || "/placeholder.png"); // Set the image URL or placeholder
      } else {
        setProfilePicUrl("/placeholder.png"); // Use placeholder if no profile pic
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicUrl("/placeholder.png"); // Set placeholder on error
    }
  };
  useEffect(() => {
    fetchProfilePicture(dentistry_id);
  }, []);
  return (
    <div>
      {/* Desktop View */}
      <div className="desktopview-header">
        <div
          className={`flex items-center align-items-center justify-content-between ${scrolled ? "scrolled-header bg-neutral-200" : ""
            } transition-all`}
          id="onscroll-header"
        >
          {/* Profile image shown on scroll */}
          <div
            className={`onscroll-profile ${scrolled ? "d-block" : "d-none"}`}
          >
            <Image
              src={profilePicUrl || "/placeholder.png"}
              alt="profile"
              width={40}
              height={40}
              className="img-fluid"
            />
          </div>

          {/* Username and verification */}
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <h6 className="fw-medium">@{username}</h6>
            {/* Verification icon - uncomment if needed */}
            {/* <Image
              src="/assets/Verify.svg"
              alt="check"
              className="img-fluid w-auto"
            /> */}
          </div>

          {/* Dots icon for modal trigger */}
          <div className="flex items-center">
            <a href={`mailto:${contact_email}`} id="onscroll-hide-contact-btn">
              <button className="contact-me-btn whitespace-nowrap">
                Contact me
              </button>
            </a>

            <ShareModal username={username} />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobileview-header">
        <div
          className={`d-flex align-items-center justify-content-between ${scrolled ? "scrolled-header bg-neutral-200" : ""
            } transition-all`}
          id="onscroll-header-mobile"
        >
          {/* Logo disappears on scroll */}
          {!scrolled && (
            <a href="/" id="header_logo">
              <Image
                src="/logo.svg"
                alt="logo"
                width={100}
                height={40}
                className="img-fluid mobile-logo"
              />
            </a>
          )}

          {/* Username visible on scroll */}
          <div className={`${scrolled ? "d-block" : "d-none"}`}>
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <h6 className="fw-medium">@{username}</h6>
            </div>
          </div>

          {/* Contact and modal button */}
          <div className="d-flex align-items-center gap-2">
            {!scrolled && (
              <a href={`mailto:${contact_email}`} id="onscroll-hide-contact-btn">
                <button className="contact-me-btn whitespace-nowrap">
                  Contact me
                </button>
              </a>
            )}
            <ShareModal username={username} />
          </div>
        </div>
      </div>
    </div>
  );
}
