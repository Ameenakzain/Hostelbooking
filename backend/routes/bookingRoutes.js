router.get("/user-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate("hostel");
        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found" });
        }
        res.json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
