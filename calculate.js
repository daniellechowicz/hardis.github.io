var app = new Vue({
    el: "#app",
    data: {
        moisture_content: 0,
        cutting_fibre_angle: 0,
        cutting_velocity: 5,
        density: 600,
        uncut_chip_thickness: 0.01,
        cutting_width: 1,
        cutting_force: "",
    },
    created() {
        this.calculate_cutting_force();
    },
    updated() {
        this.calculate_cutting_force();
    },
    methods: {
        calculate_cutting_force: function() {
            // Get the parameters from the form.
            // Conversion (Ondrej's model parameters).
            A = this.moisture_content;
            B = this.cutting_fibre_angle;
            C = this.cutting_velocity;
            D = this.uncut_chip_thickness;

            // Model for MC, FA and velocity.
            spec_force_1 =
                7.04211 +
                -0.062299 * A +
                0.2274 * B +
                -0.121388 * C +
                0.0109825 * A * B +
                0.00195076 * A * C +
                0.0109557 * A * A +
                -0.00783311 * B * B +
                0.00316762 * C * C +
                -0.00082294 * A * A * B +
                -3.59108e-6 * A * B * B +
                -2.78869e-5 * A * C * C +
                -0.000336306 * A * A * A +
                0.000125868 * B * B * B +
                -1.54863e-5 * C * C * C +
                3.40928e-6 * A * A * B * B +
                1.12721e-5 * A * A * A * B +
                -7.58739e-7 * A * B * B * B +
                -6.25039e-7 * B * B * B * B;

            // Model for MC, chip thickness and velocity.
            spec_force_2 =
                2.91501 +
                0.0835908 * A +
                -0.102696 * C +
                -8.37811 * D +
                -0.00468327 * A * C +
                1.24946 * A * D +
                -0.281406 * C * D +
                -8.99271e-5 * A * A +
                0.00428216 * C * C +
                133.088 * D * D +
                0.0111487 * A * C * D +
                7.80567e-5 * A * A * C +
                -0.0515569 * A * A * D +
                -1.14786 * A * D * D +
                0.00630141 * C * C * D +
                -0.430491 * C * D * D +
                -3.52967e-5 * C * C * C +
                -59.5688 * D * D * D;

            // Model for given MC and velocity but fixed chip thickness of 0.2 mm.
            spec_force_3 =
                2.91501 +
                0.0835908 * A +
                -0.102696 * C +
                -8.37811 * 0.2 +
                -0.00468327 * A * C +
                1.24946 * A * 0.2 +
                -0.281406 * C * 0.2 +
                -8.99271e-5 * A * A +
                0.00428216 * C * C +
                133.088 * 0.2 * 0.2 +
                0.0111487 * A * C * 0.2 +
                7.80567e-5 * A * A * C +
                -0.0515569 * A * A * 0.2 +
                -1.14786 * A * 0.2 * 0.2 +
                0.00630141 * C * C * 0.2 +
                -0.430491 * C * 0.2 * 0.2 +
                -3.52967e-5 * C * C * C +
                -59.5688 * 0.2 * 0.2 * 0.2;

            // Complete model.
            cutting_force =
                (spec_force_1 + spec_force_2 - spec_force_3) * this.cutting_width +
                (-645.19 + this.density) * (0.3037 / 20);

            // Round to one decimal place and set it.
            this.cutting_force = cutting_force.toFixed(10);
        },
    },
    watch: {
        moisture_content: function() {
            if (this.moisture_content >= 32) {
                this.moisture_content = 32;
            } else if (this.moisture_content <= 0) {
                this.moisture_content = 0;
            }
        },
        cutting_fibre_angle: function() {
            if (this.cutting_fibre_angle >= 90) {
                this.cutting_fibre_angle = 90;
            } else if (this.cutting_fibre_angle <= 0) {
                this.cutting_fibre_angle = 0;
            }
        },
        cutting_velocity: function() {
            if (this.cutting_velocity >= 80) {
                this.cutting_velocity = 80;
            } else if (this.cutting_velocity <= 5) {
                this.cutting_velocity = 5;
            }
        },
        density: function() {
            if (this.density >= 800) {
                this.density = 800;
            } else if (this.density <= 600) {
                this.density = 600;
            }
        },
        uncut_chip_thickness: function() {
            if (this.uncut_chip_thickness >= 0.6) {
                this.uncut_chip_thickness = 0.6;
            } else if (this.uncut_chip_thickness <= 0.01) {
                this.uncut_chip_thickness = 0.01;
            }
        },
        cutting_width: function() {
            if (this.cutting_width >= 30) {
                this.cutting_width = 30;
            } else if (this.cutting_width <= 1) {
                this.cutting_width = 1;
            }
        },
    },
});