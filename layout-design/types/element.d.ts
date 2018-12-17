import Vue = require("vue");

declare module "vue/types/vue" {
    interface Vue {
        validate(callback?: (valid: boolean) => void): void;
        $alert: any;
        $message: any;
        $confirm: any;
        $notify: any;
        model: any;
    }
}